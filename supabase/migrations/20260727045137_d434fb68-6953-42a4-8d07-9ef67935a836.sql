
DROP POLICY "Guests and users submit enquiry" ON public.b2b_enquiries;
CREATE POLICY "Guests and users submit enquiry" ON public.b2b_enquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(company) BETWEEN 1 AND 200 AND
    length(contact_person) BETWEEN 1 AND 200 AND
    length(phone) BETWEEN 5 AND 30 AND
    length(email) BETWEEN 3 AND 200
  );
