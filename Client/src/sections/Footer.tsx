import { Link } from "react-router-dom";

const user = "malek.boulellou";
const domain = "proton.me";

function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="" style={{ backgroundColor: "var(--accent-gray)" }}>
			{/* Main Footer Content */}
			<div className="section-container">
				<div className="grid grid-cols-1 md:grid-cols-5 gap-8">
					{/* Brand Section */}
					<div className="col-span-1 md:col-span-2">
						<a href="/" className="inline-block mb-4">
							<img
								src="/images/extras/Placeholder car logo.svg"
								alt=""
								className="w-40 h-auto"
							/>
						</a>
						<p className="text-white text-md leading-relaxed mb-4">
							Your trusted partner in finding the perfect vehicle.
							Quality cars, transparent pricing, and exceptional
							service since 2003.
						</p>
						<p className="text-[var(--primary-orange-light)] text-sm italic mb-4">
							"Drive Your Dreams, Own Your Journey"
						</p>
						<div className="text-left">
							<p className="text-gray-400 text-sm">
								© {currentYear} AutoDealer. All rights reserved.
							</p>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-white font-semibold mb-4 text-lg uppercase tracking-wide">
							Quick Links
						</h3>
						<ul className="space-y-2 text-md">
							<li>
								<Link
									to="/latest"
									className="text-gray-300 transition-colors"
									style={
										{
											"--hover-color":
												"var(--primary-orange-light)",
										} as React.CSSProperties
									}
									onMouseEnter={(e) =>
										(e.currentTarget.style.color =
											"var(--primary-orange-light)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = "")
									}
								>
									Latest Arrivals
								</Link>
							</li>
							<li>
								<Link
									to="/explore"
									className="text-gray-300 transition-colors"
									onMouseEnter={(e) =>
										(e.currentTarget.style.color =
											"var(--primary-orange-light)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = "")
									}
								>
									Explore Inventory
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="text-gray-300 transition-colors"
									onMouseEnter={(e) =>
										(e.currentTarget.style.color =
											"var(--primary-orange-light)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = "")
									}
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="text-gray-300 transition-colors"
									onMouseEnter={(e) =>
										(e.currentTarget.style.color =
											"var(--primary-orange-light)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = "")
									}
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-white font-semibold mb-4 text-lg uppercase tracking-wide">
							Get In Touch
						</h3>
						<ul className="space-y-3 text-md">
							<li className="flex items-start space-x-3">
								<svg
									className="w-6 h-6 mt-0.5 flex-shrink-0"
									style={{ color: "var(--primary-orange)" }}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<span className="text-gray-300">
									123 Main Street
									<br />
									Anytown, ST 12345
								</span>
							</li>
							<li className="flex items-center space-x-3">
								<svg
									className="w-6 h-6 flex-shrink-0"
									style={{ color: "var(--primary-orange)" }}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
								<a
									href="tel:+15551234567"
									className="text-gray-300 transition-colors"
									onMouseEnter={(e) =>
										(e.currentTarget.style.color =
											"var(--primary-orange-light)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = "")
									}
								>
									(555) 123-4567
								</a>
							</li>
							<li className="flex items-center space-x-3">
								<svg
									className="w-6 h-6 flex-shrink-0"
									style={{ color: "var(--primary-orange)" }}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<a
									href="mailto:info@autodealer.com"
									className="text-gray-300 transition-colors"
									onMouseEnter={(e) =>
										(e.currentTarget.style.color =
											"var(--primary-orange-light)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = "")
									}
								>
									info@autodealer.com
								</a>
							</li>
						</ul>
					</div>

					{/* Social Media */}
					<div>
						<h3 className="text-white font-semibold mb-4 text-lg uppercase tracking-wide">
							Connect With Us
						</h3>
						<ul className="space-y-6 text-md">
							<li className="flex items-center space-x-3">
								<svg
									className="w-6 h-6 mt-0.5 flex-shrink-0"
									style={{ color: "var(--primary-orange)" }}
									fill="currentColor"
									stroke="none"
									viewBox="0 0 24 24"
								>
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
								<a
									className="text-gray-300 transition-colors"
									onMouseEnter={(e) =>
										(e.currentTarget.style.color =
											"var(--primary-orange-light)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = "")
									}
								>
									facebook.com/placeholder
								</a>
							</li>
							<li className="flex items-center space-x-3">
								<svg
									className="w-6 h-6 flex-shrink-0"
									style={{ color: "var(--primary-orange)" }}
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
								<a
									className="text-gray-300 transition-colors"
									onMouseEnter={(e) =>
										(e.currentTarget.style.color =
											"var(--primary-orange-light)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = "")
									}
								>
									instagram.com/placeholder
								</a>
							</li>
							<li className="flex items-center space-x-3">
								<svg
									className="w-6 h-6 flex-shrink-0"
									style={{ color: "var(--primary-orange)" }}
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12,0C5.37256,0,0,5.37256,0,12s5.37256,12,12,12,12-5.37262,12-12S18.62744,0,12,0ZM19,10.50879c-1.41626,0-2.7373-.34064-3.82672-1.43005v5.57013c0,3.41821-2.61493,5.22955-5.0799,5.22955-2.8056,0-5.09338-2.23328-5.09338-5.14783,0-2.75079,2.31537-4.97064,5.0799-4.97064.20447,0,.44952.01343.69464.05444v2.7124c-1.68854-.17712-2.9552.67859-2.9552,2.29932,0,1.40277,1.08942,2.30518,2.315,2.30518s2.23334-.9024,2.23334-2.30518V4.12189h2.51941v-.00031c.43579,2.61456,2.36981,3.75848,4.11292,3.88123v2.50598Z" />
								</svg>

								<a
									className="text-gray-300 transition-colors"
									onMouseEnter={(e) =>
										(e.currentTarget.style.color =
											"var(--primary-orange-light)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.color = "")
									}
								>
									tiktok.com/placeholder
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t-2 border-gray-300 text-center py-6">
				<p className="text-base text-gray-300 font-medium">
					This is a demo website — it does not process real data or
					perform meaningful actions. For inquiries, contact me at{" "}
					<a
						href={`mailto:${user}@${domain}`}
						className="text-[var(--primary-orange)] underline-offset-2 hover:underline"
					>
						{`${user}@${domain}`}
					</a>
					.
				</p>
			</div>
		</footer>
	);
}

export default Footer;
