import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { type Vehicle, parseVehicleDetails } from "../types/Vehicle";

import HeroSection from "../sections/HeroSection";
import ReviewsCarousel from "../sections/ReviewsCarousel";
import Footer from "../sections/Footer";
import CtaCard from "../sections/CtaCard";

import DetailsDrawer from "../components/DetailsDrawer";

function Latest() {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
		null
	);

	const recentVehicles = [...vehicles].reverse().slice(0, 6);

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const res = await fetch("/api/vehicles");
				if (!res.ok) {
					throw new Error("Failed to fetch vehicles");
				}

				const data = await res.json();
				setVehicles(data);
				setLoading(false);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "An unknown error occured"
				);
				setLoading(false);
			}
		};

		fetchVehicles();
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const vehicleId = params.get("vehicleId");

		if (vehicleId && recentVehicles.length > 0) {
			const vehicle = recentVehicles.find(
				(v) => v.id === Number(vehicleId)
			);
			if (vehicle) {
				setSelectedVehicle(vehicle);
			}
		} else if (!vehicleId) {
			// Clear selected vehicle when vehicleId is removed from URL
			setSelectedVehicle(null);
		}
	}, [location.search, recentVehicles]);

	useEffect(() => {
		if (selectedVehicle) {
			// Lock scroll
			document.body.style.overflow = "hidden";
		} else {
			// Restore scroll
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [selectedVehicle]);

	return (
		<>
			<div className="relative mb-8">
				<HeroSection />
			</div>

			<section
				id="latest-arrivals"
				className="section-container pt-4 scroll-mt-12 md:scroll-mt-16 mb-8"
			>
				<div>
					<h1 className="text-3xl font-bold sm:heading-primary">
						Latest Arrivals
					</h1>
					<p className="heading-secondary">
						Discover our best deals and the newest offers!
					</p>

					<div className="mb-12">
						{loading ? (
							<p className="font-mono text-center py-8">
								Loading Vehicles...
							</p>
						) : error ? (
							<div
								id="latest-arrival"
								className="font-mono text-center py-8 text-red-600"
							>
								Error: {error}
							</div>
						) : vehicles.length === 0 ? (
							<div
								id="latest-arrival"
								className="text-center py-8 text-red-600"
							>
								No Vehicles Are Available
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
								{recentVehicles.map((vehicle) => {
									const details = parseVehicleDetails(
										vehicle.detailsJson
									);

									const firstImage =
										details?.thumbnail ||
										(Array.isArray(details?.images) &&
										details.images.length > 0
											? details.images[0]
											: null);

									return (
										<div key={vehicle.id}>
											<div className="card p-4">
												<div className="flex items-center justify-center mb-4 overflow-hidden bg-gray-200 h-48 rounded-lg">
													{firstImage ? (
														<img
															src={`/api/vehicles/images/${firstImage}`}
															alt={`${vehicle.make} ${vehicle.model}`}
															className="w-full h-full object-cover"
															loading="lazy"
															onError={(e) => {
																const parent =
																	e
																		.currentTarget
																		.parentElement;

																if (parent) {
																	parent.innerHTML = `<p class="text-gray-500">${vehicle.make} ${vehicle.model}</p>`;
																}
															}}
														/>
													) : (
														<img
															src={`/images/${vehicle.make}.png`}
															alt={`${vehicle.make} ${vehicle.model}`}
															className="w-full h-full object-contain p-8"
															loading="lazy"
														/>
													)}
												</div>
												<div className="flex flex-row justify-between">
													<div>
														<h3 className="text-xl font-semibold mb-2">
															{vehicle.year}{" "}
															{vehicle.make}{" "}
															{vehicle.model}
														</h3>
														<p className="price-text mb-2">
															$
															{vehicle.price.toLocaleString()}
														</p>
														<p
															className={`w-fit ${
																vehicle.status ===
																"AVAILABLE"
																	? "badge-available"
																	: vehicle.status ===
																	  "SOLD"
																	? "badge-sold"
																	: "badge-pending"
															}`}
														>
															{vehicle.status}
														</p>
													</div>
													<div className="flex flex-col justify-center">
														<img
															src={`/images/${vehicle.make}.png`}
															className="w-14 h-auto"
															alt=""
															loading="lazy"
														/>
													</div>
												</div>
												<button
													className="btn-primary w-full mt-4"
													onClick={() => {
														const params =
															new URLSearchParams(
																location.search
															);
														params.set(
															"vehicleId",
															vehicle.id.toString()
														);
														navigate(
															`/latest?${params.toString()}`
														);
													}}
												>
													Details
												</button>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					<div className="flex justify-center items-center w-full">
						<a
							href="/explore"
							className="w-[92%] sm:w-[95%] md:w-[50%] lg:w-[29%]"
						>
							<button className="w-full btn-primary text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-xl px-5 py-2.5 text-center me-2 inline-flex items-center justify-center hover:-translate-y-1">
								Looking for more? Click here
								<svg
									className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 10"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M1 5h12m0 0L9 1m4 4L9 9"
									/>
								</svg>
							</button>
						</a>
					</div>
				</div>
			</section>

			{/* Carousel Text */}
			<div className="w-full mb-8 py-8 border-y border-gray-300 bg-[var(--bg-dark)]">
				<div className="section-container">
					<h1 className="text-3xl font-bold sm:heading-primary">
						Reviews
					</h1>
					<p className="heading-secondary">
						Check out what our loyal customers have said about
						AutoDeal
					</p>
				</div>
				<ReviewsCarousel />
			</div>

			{/* CTA Card */}
			<div className="flex items-center justify-center mb-8 py-8">
				<CtaCard numberOfOffers={vehicles.length} />
			</div>

			<div className="text-center text-[var(--text-medium)] text-lg font-semibold mb-8 italic px-8">
				Our commitment to quality and customer satisfaction ensures that
				when you choose your next car here, you’re making the right
				choice.
			</div>

			<div className="pt-8">
				<Footer />
			</div>

			<DetailsDrawer
				vehicle={selectedVehicle}
				onClose={() => {
					const params = new URLSearchParams(location.search);
					params.delete("vehicleId");
					navigate(`/latest?${params.toString()}`, { replace: true });
				}}
			/>
		</>
	);
}

export default Latest;
