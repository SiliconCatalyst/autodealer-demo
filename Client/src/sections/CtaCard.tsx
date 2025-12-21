type CtaCardProp = {
	numberOfOffers: number;
};

export default function CtaCard({ numberOfOffers }: CtaCardProp) {
	return (
		<div className="relative bg-[var(--bg-lighter)] w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] mx-auto overflow-visible rounded-xl shadow-md shadow-black/15">
			<div className="relative flex flex-row justify-between z-30">
				<div className="p-6 md:p-10 z-10 w-full lg:w-[60%] space-y-4 sm:mr-4">
					<h1 className="uppercase text-3xl sm:text-4xl font-extrabold text-[var(--primary-orange-light)] leading-tight">
						Your next car is waiting for{" "}
						<span className="italic underline text-[var(--primary-orange-dark)]">
							you
						</span>
						.
					</h1>
					<div className="w-[60%] lg:w-full">
						<p className="text-[var(--text-medium)] text-md sm:text-xl font-semibold leading-tight">
							Discover all the available offers at AutoDealer
						</p>
					</div>
					<div className="flex flex-row gap-4">
						<a href="/explore">
							<button className="btn-primary text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 hover:-translate-y-1">
								Explore all {numberOfOffers} Offers
							</button>
						</a>
					</div>
				</div>

				<div className="absolute inset-0 overflow-hidden rounded-xl">
					{/* Wide gradient shape */}
					<div className="hidden sm:block absolute -bottom-14 -right-10 bg-gradient-to-tr from-gray-100 to-gray-500 transform origin-center z-10 w-[20%] h-full sm:rotate-[25deg] lg:rotate-[35deg] scale-150" />

					{/* Thin gradient shape */}
					<div className="hidden lg:block absolute -bottom-14 right-48 bg-gradient-to-tr from-gray-100 to-gray-500 transform origin-center z-10 w-12 h-[calc(100%+150px)] rotate-[35deg]" />
				</div>

				<img
					src="/images/extras/911.png"
					alt="Car"
					className="z-20 absolute bottom-0 right-0 w-40 sm:w-56 lg:w-80 h-auto"
					loading="lazy"
				/>
			</div>

			{/* Bottom Section */}
			<div className="p-2 bg-gray-300/30 flex justify-center rounded-b-xl shadow-inner shadow-black/15">
				<div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
					{/* Call us */}
					<div className="flex  items-center p-4 space-x-4">
						<div className="p-4 bg-[var(--bg-lighter)] rounded-full shadow-sm shadow-black/20">
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
						</div>

						<div className="text-left">
							<h3 className="text-lg font-semibold">Call Us</h3>
							<p className="text-[var(--text-medium)]">
								(555) 123-4567
							</p>
						</div>
					</div>

					{/* Email us */}
					<div className="flex items-center p-4 space-x-4">
						<div className="p-4 bg-[var(--bg-lighter)] rounded-full shadow-sm shadow-black/20">
							<svg
								id="Layer_1"
								xmlns="http://www.w3.org/2000/svg"
								className="w-6 h-5 flex-shrink-0"
								style={{ color: "var(--primary-orange)" }}
								fill="currentColor"
								viewBox="0 0 24 23.88819"
							>
								<path d="M14.70767,6.74563l.31057-1.37894h3.27964l-1.88828,8.90722c-.11595.56317-.17392.93586-.17392,1.11806,0,.19048.04969.33956.14493.44722s.20705.1615.33956.1615c.44722,0,1.02696-.29194,1.73506-.87581s1.32511-1.37894,1.85101-2.3852.78678-2.10568.78678-3.29828c0-.99383-.18634-1.92969-.56317-2.80757s-.92344-1.63982-1.63568-2.28581-1.59013-1.15119-2.63779-1.51559-2.23612-.54661-3.56019-.54661c-1.34995,0-2.5881.17599-3.71445.52797s-2.11603.85718-2.96907,1.51559-1.56528,1.47211-2.13674,2.4411c-.5052.84476-.89031,1.78062-1.15533,2.80757s-.39753,2.07462-.39753,3.14299c0,1.42449.28366,2.72683.85097,3.907.56731,1.18121,1.39136,2.1709,2.47216,2.97011s2.38727,1.36652,3.91942,1.70194,3.26308.40167,5.19174.20291c1.53216-.1822,2.83242-.53004,3.89665-1.04352s1.96282-1.23401,2.69991-2.16158h2.64608c-.43066.88617-.98969,1.67709-1.68123,2.37277s-1.50317,1.2837-2.43075,1.75991-1.96696.83648-3.11815,1.08493-2.4059.37269-3.7631.37269c-2.03735,0-3.8718-.26502-5.50334-.79921s-3.00427-1.3044-4.11819-2.31066-1.95661-2.20713-2.52806-3.60368c-.57145-1.39551-.85718-2.93801-.85718-4.62753,0-1.76405.29401-3.41216.88203-4.94431s1.43484-2.86348,2.54048-3.99396S5.8781,1.59427,7.47237.95656s3.35211-.95656,5.27352-.95656c1.57253,0,3.01773.22982,4.33041.68947s2.43489,1.12013,3.37075,1.98145,1.65225,1.88207,2.14502,3.06224.73709,2.48251.73709,3.907c0,1.10978-.19877,2.19678-.5963,3.26101s-.96484,2.02079-1.70608,2.86969-1.61498,1.51973-2.61709,2.01354c-1.00211.49277-2.08291.73709-3.24238.73709-.67084,0-1.1926-.11181-1.56425-.33956-.37269-.22775-.62114-.59216-.74537-1.08804-.72053.71121-1.54872,1.16258-2.48458,1.34892s-1.84273.09938-2.72061-.26088-1.58806-.96795-2.13053-1.82099-.8137-1.90484-.8137-3.15542c0-1.30026.27952-2.57982.83855-3.83867s1.3541-2.28995,2.3852-3.0933,2.19678-1.20502,3.49705-1.20502c1.49075,0,2.58293.55903,3.27861,1.67709ZM7.91338,13.18069c0,.99383.20705,1.75577.62114,2.28581s.95656.79507,1.6274.79507c.7785,0,1.46383-.31057,2.05599-.93172s1.04145-1.40586,1.34788-2.35414c.3054-.94828.45861-1.8655.45861-2.75167,0-.43894-.04969-.8344-.15322-1.18639s-.25778-.66048-.46068-.92551-.44722-.46586-.73295-.60251-.61079-.20498-.9752-.20498c-.72881,0-1.38515.28366-1.96903.85097s-1.03317,1.3044-1.34788,2.21128-.47207,1.8448-.47207,2.81379Z" />
							</svg>
						</div>

						<div className="text-left">
							<h3 className="text-lg font-semibold">Email Us</h3>
							<a
								href="mailto:info@autodealer.com"
								className="text-[var(--text-medium)] underline"
							>
								info@autodealer.com
							</a>
						</div>
					</div>

					{/* Visit us */}
					<div className="flex md:hidden lg:flex items-center p-4 space-x-4">
						<div className="p-4 bg-[var(--bg-lighter)] rounded-full shadow-sm shadow-black/20">
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
						</div>

						<div className="text-left">
							<h3 className="text-lg font-semibold">Visit Us</h3>
							<p className="text-gray-600">
								123 Main Street, City
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
