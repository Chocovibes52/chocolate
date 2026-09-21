import { r as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as supabase } from "./client-BjZKsg4o.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as EyeOff, D as Mail, V as CreditCard, _ as Save, o as Truck, z as Eye } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-36kLn-PW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSettings() {
	const qc = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["app_settings"],
		queryFn: async () => {
			const { data, error } = await supabase.from("app_settings").select("key, value");
			if (error) throw error;
			const map = {};
			for (const r of data ?? []) map[r.key] = r.value;
			return map;
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-primary/70",
		children: "Loading settings…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl text-primary",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-primary/60",
				children: "Configure SMTP email, Razorpay payments, and shipping integration. Values are stored securely and only accessible to admins."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmtpCard, {
				initial: data?.smtp,
				onSaved: () => qc.invalidateQueries({ queryKey: ["app_settings"] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RazorpayCard, {
				initial: data?.razorpay,
				onSaved: () => qc.invalidateQueries({ queryKey: ["app_settings"] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShippingCard, {
				initial: data?.shipping,
				onSaved: () => qc.invalidateQueries({ queryKey: ["app_settings"] })
			})
		]
	});
}
function Section({ icon: Icon, title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-primary/10 bg-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md bg-primary/5 p-2 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 20 })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-xl text-primary",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-primary/60",
				children: description
			})] })]
		}), children]
	});
}
function Field({ label, children, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 block text-xs font-medium uppercase tracking-wider text-primary/70",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-xs text-primary/50",
				children: hint
			}) : null
		]
	});
}
var inputCls = "w-full rounded-md border border-primary/15 bg-background px-3 py-2 text-sm text-primary focus:border-accent focus:outline-none";
function SecretInput({ value, onChange, placeholder }) {
	const [show, setShow] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: show ? "text" : "password",
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "w-full rounded-md border border-primary/15 bg-background px-3 py-2 text-sm text-primary focus:border-accent focus:outline-none pr-10",
			autoComplete: "off"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setShow((s) => !s),
			className: "absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary",
			"aria-label": show ? "Hide" : "Show",
			children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 })
		})]
	});
}
async function saveSetting(key, value) {
	const { data: userRes } = await supabase.auth.getUser();
	const { error } = await supabase.from("app_settings").upsert({
		key,
		value,
		updated_by: userRes.user?.id ?? null
	}, { onConflict: "key" });
	if (error) throw error;
}
function SaveBtn({ saving }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "submit",
		disabled: saving,
		className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 16 }),
			" ",
			saving ? "Saving…" : "Save changes"
		]
	});
}
function SmtpCard({ initial, onSaved }) {
	const [s, setS] = (0, import_react.useState)({
		host: "",
		port: 587,
		username: "",
		password: "",
		from_email: "",
		from_name: "ChocoVibes",
		secure: true
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (initial) setS({
			...s,
			...initial
		});
	}, [initial]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		icon: Mail,
		title: "SMTP Email",
		description: "Used to send order confirmations, Corporate & B2B replies, and transactional emails.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: async (e) => {
				e.preventDefault();
				setSaving(true);
				try {
					await saveSetting("smtp", s);
					toast.success("SMTP settings saved");
					onSaved();
				} catch (err) {
					toast.error(err.message ?? "Failed to save");
				} finally {
					setSaving(false);
				}
			},
			className: "grid gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "SMTP Host",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: s.host,
						onChange: (e) => setS({
							...s,
							host: e.target.value
						}),
						placeholder: "smtp.gmail.com"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Port",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: inputCls,
						value: s.port,
						onChange: (e) => setS({
							...s,
							port: Number(e.target.value)
						}),
						placeholder: "587"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Username",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: s.username,
						onChange: (e) => setS({
							...s,
							username: e.target.value
						}),
						placeholder: "chocovibes52@gmail.com"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Password / App Password",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecretInput, {
						value: s.password,
						onChange: (v) => setS({
							...s,
							password: v
						}),
						placeholder: "••••••••"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "From Email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: s.from_email,
						onChange: (e) => setS({
							...s,
							from_email: e.target.value
						}),
						placeholder: "chocovibes52@gmail.com"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "From Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: s.from_name,
						onChange: (e) => setS({
							...s,
							from_name: e.target.value
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm text-primary/80 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: s.secure,
						onChange: (e) => setS({
							...s,
							secure: e.target.checked
						})
					}), "Use TLS/SSL (recommended)"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBtn, { saving })
				})
			]
		})
	});
}
function RazorpayCard({ initial, onSaved }) {
	const [s, setS] = (0, import_react.useState)({
		key_id: "",
		key_secret: "",
		webhook_secret: "",
		mode: "test"
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (initial) setS({
			...s,
			...initial
		});
	}, [initial]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		icon: CreditCard,
		title: "Razorpay Payments",
		description: "Add your Razorpay API keys to accept online payments at checkout.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: async (e) => {
				e.preventDefault();
				setSaving(true);
				try {
					await saveSetting("razorpay", s);
					toast.success("Razorpay settings saved");
					onSaved();
				} catch (err) {
					toast.error(err.message ?? "Failed to save");
				} finally {
					setSaving(false);
				}
			},
			className: "grid gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mode",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: inputCls,
						value: s.mode,
						onChange: (e) => setS({
							...s,
							mode: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "test",
							children: "Test"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "live",
							children: "Live"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Key ID",
					hint: "Starts with rzp_test_ or rzp_live_",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: s.key_id,
						onChange: (e) => setS({
							...s,
							key_id: e.target.value
						}),
						placeholder: "rzp_test_XXXXXXXXXX"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Key Secret",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecretInput, {
						value: s.key_secret,
						onChange: (v) => setS({
							...s,
							key_secret: v
						}),
						placeholder: "••••••••"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Webhook Secret",
					hint: "Optional — used to verify Razorpay webhooks",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecretInput, {
						value: s.webhook_secret,
						onChange: (v) => setS({
							...s,
							webhook_secret: v
						}),
						placeholder: "••••••••"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBtn, { saving })
				})
			]
		})
	});
}
function ShippingCard({ initial, onSaved }) {
	const [s, setS] = (0, import_react.useState)({
		provider: "shiprocket",
		api_key: "",
		api_secret: "",
		pickup_pincode: "395009",
		default_weight_g: 300,
		enabled: false
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (initial) setS({
			...s,
			...initial
		});
	}, [initial]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		icon: Truck,
		title: "Shipping Integration",
		description: "Connect a shipping provider to generate labels and track orders.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: async (e) => {
				e.preventDefault();
				setSaving(true);
				try {
					await saveSetting("shipping", s);
					toast.success("Shipping settings saved");
					onSaved();
				} catch (err) {
					toast.error(err.message ?? "Failed to save");
				} finally {
					setSaving(false);
				}
			},
			className: "grid gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Provider",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: inputCls,
						value: s.provider,
						onChange: (e) => setS({
							...s,
							provider: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "shiprocket",
								children: "Shiprocket"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "delhivery",
								children: "Delhivery"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "bluedart",
								children: "Blue Dart"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "dtdc",
								children: "DTDC"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "manual",
								children: "Manual / Self-ship"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Pickup Pincode",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: s.pickup_pincode,
						onChange: (e) => setS({
							...s,
							pickup_pincode: e.target.value
						}),
						placeholder: "395009"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "API Key / Email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: inputCls,
						value: s.api_key,
						onChange: (e) => setS({
							...s,
							api_key: e.target.value
						}),
						placeholder: "account@example.com"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "API Secret / Password",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecretInput, {
						value: s.api_secret,
						onChange: (v) => setS({
							...s,
							api_secret: v
						}),
						placeholder: "••••••••"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Default Package Weight (grams)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: inputCls,
						value: s.default_weight_g,
						onChange: (e) => setS({
							...s,
							default_weight_g: Number(e.target.value)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm text-primary/80 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: s.enabled,
						onChange: (e) => setS({
							...s,
							enabled: e.target.checked
						})
					}), "Enable shipping integration"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveBtn, { saving })
				})
			]
		})
	});
}
//#endregion
export { AdminSettings as component };
