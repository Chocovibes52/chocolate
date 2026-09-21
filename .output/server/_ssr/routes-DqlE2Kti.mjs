import { r as __toESM } from "../_runtime.mjs";
import { t as story_default } from "./story-DdBJpMLZ.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Leaf, H as ChevronRight, U as ChevronLeft, o as Truck, p as ShieldCheck, q as ArrowRight, u as Sparkles } from "../_libs/lucide-react.mjs";
import { a as testimonialsQuery, r as productsByCategoryQuery, t as ProductCard } from "./products-BrPBlLkZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DqlE2Kti.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_1_default = "/assets/hero-1-Ceb1H20E.jpg";
var hero_2_default = "/assets/hero-2-BYMrGjPw.jpg";
var banners = [{
	image: hero_1_default,
	eyebrow: "Signature Collection",
	heading: "Chocolate,\ncrafted with obsession.",
	sub: "Single-origin cacao. Hand-tempered in small batches. Delivered to your door.",
	cta: "Shop Energy Bars",
	to: "/energy-bars"
}, {
	image: hero_2_default,
	eyebrow: "Gifting Season",
	heading: "The art of\nunforgettable gifting.",
	sub: "Curated hampers, hand-tied in silk. Presented in lacquered walnut boxes.",
	cta: "Explore Hampers",
	to: "/gift-hampers"
}];
function Home() {
	const [i, setI] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setI((v) => (v + 1) % banners.length), 6500);
		return () => clearInterval(t);
	}, []);
	const { data: barsAll = [] } = useQuery(productsByCategoryQuery("energy-bars"));
	const { data: hampersAll = [] } = useQuery(productsByCategoryQuery("gift-hampers"));
	const { data: testimonials = [] } = useQuery(testimonialsQuery());
	const bars = barsAll.filter((p) => p.bestSeller).slice(0, 3);
	const hampers = hampersAll.filter((p) => p.bestSeller).slice(0, 3);
	const testis = testimonials.length ? testimonials.slice(0, 3) : [
		{
			id: "1",
			author: "Aarav M.",
			role: null,
			quote: "Genuinely the most refined dark chocolate bar I've had in India. The packaging alone is worth it.",
			rating: 5
		},
		{
			id: "2",
			author: "Riya S.",
			role: null,
			quote: "Sent the Grand Reserve hamper to a client. Received a hand-written thank you the next day.",
			rating: 5
		},
		{
			id: "3",
			author: "Kabir V.",
			role: null,
			quote: "I eat one after every training session. Clean energy, no crash, and unreasonably delicious.",
			rating: 5
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative h-[92vh] min-h-[600px] w-full overflow-hidden",
			children: [banners.map((b, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `absolute inset-0 transition-opacity duration-[1400ms] ${idx === i ? "opacity-100" : "opacity-0"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: b.image,
						alt: "",
						className: "w-full h-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "container-luxe",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-xl text-primary-foreground animate-fade-up",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "eyebrow !text-accent",
										children: b.eyebrow
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "mt-5 font-display text-5xl md:text-7xl leading-[1.05] whitespace-pre-line",
										children: b.heading
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-6 text-base md:text-lg text-primary-foreground/80 max-w-md",
										children: b.sub
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: b.to,
										className: "btn-gold mt-8",
										children: [
											b.cta,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })
										]
									})
								]
							})
						})
					})
				]
			}, idx)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setI((v) => (v - 1 + banners.length) % banners.length),
						className: "w-10 h-10 rounded-full border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition flex items-center justify-center",
						"aria-label": "Previous",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: banners.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setI(idx),
							className: `h-[2px] transition-all ${idx === i ? "w-10 bg-accent" : "w-6 bg-primary-foreground/40"}`,
							"aria-label": `Slide ${idx + 1}`
						}, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setI((v) => (v + 1) % banners.length),
						className: "w-10 h-10 rounded-full border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary transition flex items-center justify-center",
						"aria-label": "Next",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe py-20 md:py-28",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-2xl mx-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow",
					children: "The Collections"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-4xl md:text-5xl text-primary",
					children: "Three ways to indulge."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-6 md:grid-cols-3",
				children: [
					{
						title: "Energy Bars",
						desc: "Sustained clean energy, dark chocolate depth.",
						to: "/energy-bars",
						img: hero_1_default
					},
					{
						title: "Gift Hampers",
						desc: "Curated boxes, hand-tied in silk.",
						to: "/gift-hampers",
						img: hero_2_default
					},
					{
						title: "Corporate & B2B",
						desc: "Wholesale, private label, and bulk gifting.",
						to: "/b2b",
						img: story_default
					}
				].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: c.to,
					className: "group relative aspect-[4/5] overflow-hidden rounded-2xl block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: c.img,
							alt: c.title,
							loading: "lazy",
							className: "w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-0 left-0 right-0 p-8 text-primary-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-3xl",
									children: c.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-primary-foreground/80 max-w-xs",
									children: c.desc
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 inline-flex items-center gap-2 text-accent text-xs uppercase tracking-[0.2em]",
									children: ["Explore ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
								})
							]
						})
					]
				}, c.title))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe py-10 md:py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-6 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow",
					children: "Best Selling"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-4xl md:text-5xl text-primary",
					children: "Energy bars, elevated."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/energy-bars",
					className: "btn-outline-cocoa",
					children: ["Shop all bars ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: bars.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe py-16 md:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-6 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow",
					children: "Premium Gifting"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-4xl md:text-5xl text-primary",
					children: "Gift hampers to remember."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/gift-hampers",
					className: "btn-outline-cocoa",
					children: ["See collection ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: hampers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-secondary py-20 md:py-28 mt-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-luxe",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center max-w-xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "eyebrow",
						children: "Why ChocoVibes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl md:text-5xl text-primary",
						children: "A different kind of chocolate."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 grid gap-8 md:grid-cols-4",
					children: [
						{
							Icon: Leaf,
							title: "Premium Ingredients",
							desc: "Single-origin cacao, no refined sugar, no shortcuts."
						},
						{
							Icon: Sparkles,
							title: "Healthy Nutrition",
							desc: "Balanced macros, real food fuel, indulgence without guilt."
						},
						{
							Icon: Truck,
							title: "Fast Delivery",
							desc: "Temperature-controlled shipping across India."
						},
						{
							Icon: ShieldCheck,
							title: "Secure Payments",
							desc: "Encrypted checkout with Razorpay and COD."
						}
					].map(({ Icon, title, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto w-14 h-14 rounded-full border border-accent/40 flex items-center justify-center text-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 22 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-5 font-display text-xl text-primary",
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground max-w-[220px] mx-auto",
								children: desc
							})
						]
					}, title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-luxe py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-10 md:gap-16 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative aspect-[5/4] rounded-2xl overflow-hidden shadow-[var(--shadow-luxe)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: story_default,
						alt: "Corporate gifting",
						loading: "lazy",
						className: "w-full h-full object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "eyebrow",
						children: "Corporate & Bulk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl md:text-5xl text-primary",
						children: "Gifting that speaks for you."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-muted-foreground leading-relaxed max-w-md",
						children: "From boardroom favours to festival hampers of 5,000+ units — we handle private label, custom packaging and nationwide fulfillment. Tell us what you're planning."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/b2b",
						className: "btn-cocoa mt-8",
						children: ["Send Enquiry ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
					})
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-primary text-primary-foreground py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-luxe",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center max-w-xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "eyebrow",
						children: "Kind words"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-4xl md:text-5xl",
						children: "Loved by connoisseurs."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 grid gap-8 md:grid-cols-3",
					children: testis.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "border border-primary-foreground/10 rounded-2xl p-8 backdrop-blur bg-primary-foreground/[0.03]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-accent font-display text-4xl leading-none",
								children: "\""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
								className: "mt-3 text-primary-foreground/85 leading-relaxed",
								children: t.quote
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
								className: "mt-6 text-xs tracking-[0.2em] uppercase text-primary-foreground/60",
								children: ["— ", t.author]
							})
						]
					}, t.id))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-luxe py-20 md:py-28",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "eyebrow",
					children: "@chocovibes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-4xl md:text-5xl text-primary",
					children: "From the studio."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-2 md:grid-cols-6 gap-2",
				children: [
					hero_1_default,
					hero_2_default,
					story_default,
					hero_1_default,
					hero_2_default,
					story_default
				].map((src, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "https://instagram.com",
					target: "_blank",
					rel: "noreferrer",
					className: "relative aspect-square overflow-hidden group",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: "Instagram",
						loading: "lazy",
						className: "w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition" })]
				}, idx))
			})]
		})
	] });
}
//#endregion
export { Home as component };
