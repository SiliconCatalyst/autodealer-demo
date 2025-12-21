import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
	const [showCredit, setShowCredit] = useState(false);
	const creditRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				creditRef.current &&
				!creditRef.current.contains(event.target as Node)
			) {
				setShowCredit(false);
			}
		}

		if (showCredit) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [showCredit]);

	const scrollToArrivals = () => {
		const section = document.getElementById("latest-arrivals");
		if (section) {
			section.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<section
			id="hero"
			className="relative w-screen h-[75vh] md:h-[80vh] scroll-mt-16 md:scroll-mt-20"
		>
			{/* Responsive image */}
			<picture>
				<source srcSet="/images/extras/Hero-img.jpg" />
				<img
					src="/images/extras/Hero-img.jpg"
					alt="White BMW on the road"
					className="w-full h-full object-cover z-10"
					loading="eager"
				/>
			</picture>

			{/* Gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent z-10"></div>

			{/* Hero content */}
			<div className="absolute top-0 left-0 mx-8 sm:mx-16 lg:mx-24 mt-10 p-8 z-20 rounded-xl shadow-lg shadow-black/80 glass w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-[32vw]">
				<h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
					Find your perfect Drive
				</h1>
				<p className="text-white text-lg md:text-xl mb-6">
					Discover the art of performance and precision.
				</p>
				<button
					onClick={scrollToArrivals}
					className="btn-primary text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 hover:-translate-y-1"
				>
					Discover
				</button>
			</div>

			{/* Credit button */}
			<div ref={creditRef} className="absolute bottom-4 right-4 z-30">
				<button
					onClick={() => setShowCredit(!showCredit)}
					aria-label="Image credit information"
					className="w-7 h-7 absolute bottom-0 right-0 text-white/60 hover:text-white text-md rounded-lg transition glass"
				>
					ⓘ
				</button>

				{showCredit && (
					<div className="glass absolute bottom-8 right-0 w-64 text-white text-sm rounded-xl p-4 shadow-lg backdrop-blur-md border border-white/10 animate-fade-in">
						<p>
							Photo by{" "}
							<a
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-400"
							>
								Stephan Louis
							</a>{" "}
							on{" "}
							<a
								href="https://www.pexels.com/photo/white-bmw-car-on-road-5313947/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-400 hover:underline"
							>
								Pexels
							</a>
						</p>
					</div>
				)}
			</div>
		</section>
	);
};

export default HeroSection;
