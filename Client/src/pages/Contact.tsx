import { useState, useRef, useEffect } from "react";

import Footer from "../sections/Footer";

const Contact = () => {
	const containerRef = useRef(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const updateSize = () => {
			if (containerRef.current) {
				const { offsetWidth, offsetHeight } = containerRef.current;
				setSize({ width: offsetWidth, height: offsetHeight });
			}
		};

		// Run once on mount
		updateSize();

		// Re-run when window resizes
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	return (
		<>
			<div className="section-container">
				<div className="text-left lg:text-center mb-12">
					<h1 className="text-3xl font-bold sm:heading-primary">
						Contact Us
					</h1>
					<p className="heading-secondary">
						Get in touch with our team. We're here to help you find
						your perfect vehicle.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Contact Form */}
					<div className="stat-card p-8">
						<h2 className="text-2xl font-bold mb-6">
							Send us a Message
						</h2>
						<form className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-[var(--text-medium)] mb-2">
										First Name *
									</label>
									<input
										type="text"
										className="input-field"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-[var(--text-medium)] mb-2">
										Last Name *
									</label>
									<input
										type="text"
										className="input-field"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-[var(--text-medium)] mb-2">
									Email Address *
								</label>
								<input
									type="email"
									className="input-field"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-[var(--text-medium)] mb-2">
									Phone Number
								</label>
								<input type="tel" className="input-field" />
							</div>

							<div>
								<label className="block text-sm font-medium text-[var(--text-medium)] mb-2">
									Subject
								</label>
								<select className="select-field">
									<option>General Inquiry</option>
									<option>Vehicle Information</option>
									<option>Financing Questions</option>
									<option>Other</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-[var(--text-medium)] mb-2">
									Message *
								</label>
								<textarea
									rows={5}
									className="textarea-field resize-none"
									placeholder="How can we help you today?"
									required
								></textarea>
							</div>

							<button
								type="submit"
								className="btn-primary w-full py-3"
							>
								Send Message
							</button>
						</form>
					</div>

					{/* Contact Information */}
					<div className="space-y-8">
						{/* Location & Hours */}
						<div className="stat-card p-8">
							<h2 className="text-2xl font-bold text-[var(--text-dark)] mb-6">
								Visit Our Showroom
							</h2>
							<div className="space-y-4">
								<div>
									<h3 className="font-semibold text-[var(--text-dark)]">
										Address
									</h3>
									<p className="text-[var(--text-medium)]">
										123 Main Street
										<br />
										Anytown, ST 12345
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-[var(--text-dark)]">
										Phone
									</h3>
									<p className="text-[var(--text-medium)]">
										(555) 123-4567
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-[var(--text-dark)]">
										Email
									</h3>
									<p className="text-[var(--text-medium)]">
										info@autodealer.com
									</p>
								</div>

								<div>
									<h3 className="font-semibold text-[var(--text-dark)]">
										Business Hours
									</h3>
									<div className="text-[var(--text-medium)] space-y-1">
										<p>
											Monday - Friday: 9:00 AM - 8:00 PM
										</p>
										<p>Saturday: 9:00 AM - 6:00 PM</p>
										<p>Sunday: 12:00 PM - 5:00 PM</p>
									</div>
								</div>
							</div>
						</div>

						{/* Map Placeholder */}
						<div className="stat-card p-8">
							<h3 className="text-xl font-bold mb-4">Find Us</h3>
							<div
								ref={containerRef}
								className="rounded-lg overflow-hidden h-64"
							>
								<iframe
									title="showroom-map"
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202845.20224988792!2d-122.2062495897462!3d37.40268870045555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb68ad0cfc739%3A0x7eb356b66bd4b50e!2sSilicon%20Valley%2C%20Californie%2C%20%C3%89tats-Unis!5e0!3m2!1sfr!2sdz!4v1762633610717!5m2!1sfr!2sdz"
									width={size.width}
									height={size.height}
									style={{ border: 0 }}
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								></iframe>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="pt-8">
				<Footer />
			</div>
		</>
	);
};

export default Contact;
