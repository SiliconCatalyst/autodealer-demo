import Footer from "../sections/Footer";

const team = [
	{
		name: "John Smith",
		role: "General Manager",
		experience: "15 years experience",
	},
	{
		name: "Sarah Johnson",
		role: "Sales Director",
		experience: "12 years experience",
	},
	{
		name: "Mike Davis",
		role: "Finance Manager",
		experience: "10 years experience",
	},
];

const About = () => {
	return (
		<>
			<div className="section-container">
				<div className="text-left md:text-center mb-12">
					<h1 className="text-3xl font-bold sm:heading-primary">
						About AutoDealer
					</h1>
					<p className="heading-secondary">
						Your trusted partner in finding the perfect vehicle for
						over 20 years
					</p>
				</div>

				{/* Story Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
					<div>
						<h2 className="text-left md:text-center lg:text-left text-3xl font-bold mb-6 sm:heading-primary">
							Our Story
						</h2>
						<div className="space-y-4 text-[var(--text-dark)] text-lg">
							<p>
								Founded in 2003, AutoDealer has been serving the
								local community with quality pre-owned and new
								vehicles. We pride ourselves on our commitment
								to customer satisfaction and transparent
								pricing.
							</p>
							<p>
								Our team of experienced professionals works
								tirelessly to ensure that every customer finds
								the perfect vehicle to meet their needs and
								budget. We believe in building long-term
								relationships with our customers.
							</p>
							<p>
								With over 200 vehicles in stock and partnerships
								with major manufacturers, we offer one of the
								largest selections in the area.
							</p>
						</div>
					</div>
					<div className="bg-gray-200 rounded-lg content-fit flex items-center justify-center">
						<img
							src="/images/extras/dealership.jpeg"
							alt="dealership"
							className="rounded-lg"
							loading="lazy"
						/>
					</div>
				</div>

				{/* Values Section */}
				<div className="mb-12">
					<h2 className="text-left md:text-center text-3xl font-bold mb-8 sm:heading-primary">
						Our Values
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="card p-6 text-center">
							<h3 className="flex items-center justify-center text-2xl font-semibold mb-4 gap-2">
								<img
									src="/images/extras/shield-trust.svg"
									alt=""
									className="w-7 h-7"
								/>
								Quality
							</h3>
							<p className="text-gray-600 text-lg">
								Every vehicle undergoes thorough inspection and
								reconditioning to ensure the highest quality
								standards.
							</p>
						</div>
						<div className="card p-6 text-center">
							<h3 className="flex items-center justify-center text-2xl font-semibold mb-4 gap-2">
								<img
									src="/images/extras/vision.svg"
									alt=""
									className="w-8 h-8"
								/>
								Transparency
							</h3>
							<p className="text-gray-600 text-lg">
								No hidden fees, no surprises. We believe in
								honest, straightforward pricing and clear
								communication.
							</p>
						</div>
						<div className="card p-6 text-center">
							<h3 className="flex items-center justify-center text-2xl font-semibold mb-4 gap-2">
								<img
									src="/images/extras/compass-alt.svg"
									alt=""
									className="w-7 h-7"
								/>
								Experience
							</h3>
							<p className="text-gray-600 text-lg">
								Buying a car should feel smooth, informed, and
								supported by experienced individual who guide
								you to the right choice.
							</p>
						</div>
					</div>
				</div>

				{/* Team Section */}
				<div>
					<h2 className="text-left md:text-center text-3xl font-bold mb-8 sm:heading-primary">
						Meet Our Team
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{team.map((member, index) => (
							<div key={index} className="card p-6 text-center">
								<div className="bg-gray-200 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
									<p className="text-gray-500">Photo</p>
								</div>
								<h3 className="text-xl font-semibold mb-2">
									{member.name}
								</h3>
								<p className="text-[var(--primary-orange)] font-medium mb-2">
									{member.role}
								</p>
								<p className="text-gray-600 text-sm">
									{member.experience}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="pt-8">
				<Footer />
			</div>
		</>
	);
};

export default About;
