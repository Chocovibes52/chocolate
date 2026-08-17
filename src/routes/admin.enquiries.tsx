import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Badge, Card, EmptyState, PageHeader, statusTone } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/enquiries")({
  component: AdminEnquiries,
});

type Enquiry = Tables<"b2b_enquiries">;
const STATUSES = ["new", "contacted", "qualified", "closed"] as const;

function AdminEnquiries() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("b2b_enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Enquiry[];
    },
  });

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("b2b_enquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
  }

  return (
    <div>
      <PageHeader
        title="Corporate & B2B Enquiries"
        description="Review bulk and corporate gifting leads."
      />
      <div className="space-y-3">
        {(data ?? []).map((e) => (
          <Card key={e.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground">{e.company}</span>
                  <Badge tone={statusTone(e.status)}>{e.status}</Badge>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {e.contact_person} · {e.email} · {e.phone}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {e.business_type && <>Type: {e.business_type} · </>}
                  {e.city && <>City: {e.city} · </>}
                  {e.quantity && <>Qty: {e.quantity} · </>}
                  {new Date(e.created_at).toLocaleString()}
                </div>
              </div>
              <select
                value={e.status}
                onChange={(ev) => updateStatus(e.id, ev.target.value)}
                className="admin-input w-auto py-1 text-xs"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {e.message && (
              <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/80">{e.message}</p>
            )}
          </Card>
        ))}
        {data && data.length === 0 && (
          <Card>
            <EmptyState title="No enquiries yet" hint="Submissions from the Corporate & B2B form appear here." />
          </Card>
        )}
      </div>
    </div>

  );
}
