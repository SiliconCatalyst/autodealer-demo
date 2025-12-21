import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { type Vehicle, parseVehicleDetails } from "../types/Vehicle";

interface VehicleDetailsDrawerProps {
	vehicle: Vehicle | null;
	onClose: () => void;
}

function capitalizeWords(str: string) {
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

const DetailsDrawer = ({ vehicle, onClose }: VehicleDetailsDrawerProps) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	if (!vehicle) return null;

	const details = parseVehicleDetails(vehicle.detailsJson);
	const images = details.images || [];

	const goToPrevious = () => {
		setCurrentImageIndex((prev) =>
			prev === 0 ? images.length - 1 : prev - 1
		);
	};

	const goToNext = () => {
		setCurrentImageIndex((prev) =>
			prev === images.length - 1 ? 0 : prev + 1
		);
	};

	return (
		<AnimatePresence>
			{vehicle && (
				<>
					{/* Backdrop */}
					<motion.div
						className="modal-backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>
					{/* Drawer */}
					<motion.div
						className="fixed bottom-0 right-0 h-[calc(100%-69px)] w-full max-w-lg bg-white shadow-xl z-40 flex flex-col"
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "spring", duration: 0.4 }}
					>
						<div className="flex-1 overflow-y-auto">
							{/* Image Carousel */}
							{images.length > 0 ? (
								<div className="relative bg-gray-200 h-64 overflow-hidden group">
									{/* Current Image */}
									<motion.img
										key={currentImageIndex}
										src={`/api/vehicles/images/${images[currentImageIndex]}`}
										alt={`${vehicle.make} ${
											vehicle.model
										} - Image ${currentImageIndex + 1}`}
										className="w-full h-full object-cover"
										initial={{ opacity: 0, x: 100 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -100 }}
										transition={{ duration: 0.3 }}
										onError={(e) => {
											e.currentTarget.src =
												'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
										}}
									/>

									{/* Navigation Arrows */}
									{images.length > 1 && (
										<>
											<button
												onClick={goToPrevious}
												className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<svg
													className="w-6 h-6"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M15 19l-7-7 7-7"
													/>
												</svg>
											</button>
											<button
												onClick={goToNext}
												className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<svg
													className="w-6 h-6"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M9 5l7 7-7 7"
													/>
												</svg>
											</button>
										</>
									)}

									{/* Dots Indicator */}
									{images.length > 1 && (
										<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
											{images.map((_, index) => (
												<button
													key={index}
													onClick={() =>
														setCurrentImageIndex(
															index
														)
													}
													className={`w-2 h-2 rounded-full transition-all ${
														index ===
														currentImageIndex
															? "bg-white w-6"
															: "bg-white/50 hover:bg-white/75"
													}`}
												/>
											))}
										</div>
									)}

									{/* Image Counter */}
									{images.length > 1 && (
										<div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
											{currentImageIndex + 1} /{" "}
											{images.length}
										</div>
									)}
								</div>
							) : (
								<div className="bg-gray-200 h-64 flex items-center justify-center">
									<p className="text-gray-500">
										No images available
									</p>
								</div>
							)}

							{/* Vehicle Details */}
							<div className="p-4 space-y-4">
								<div className="space-y-2">
									<h2 className="text-3xl font-bold">
										{vehicle.year} {vehicle.make}{" "}
										{vehicle.model}
									</h2>
									<p className="price-text">
										${vehicle.price.toLocaleString()}
									</p>
								</div>

								<div className="space-y-2">
									<p>
										<strong>Year:</strong> {vehicle.year}
									</p>
									<p>
										<strong>Mileage:</strong>{" "}
										{vehicle.mileage.toLocaleString()} mile
									</p>
									<div className="flex gap-1">
										<strong>Status:</strong>{" "}
										<p
											className={`${
												vehicle.status === "AVAILABLE"
													? "badge-available"
													: vehicle.status === "SOLD"
													? "badge-sold"
													: "badge-pending"
											}`}
										>
											{vehicle.status}
										</p>
									</div>
									<p>
										<strong>Added:</strong>{" "}
										{new Date(
											vehicle.createdAt
										).toLocaleString()}
									</p>
								</div>

								<div className="border-b border-2 border-slate-300"></div>

								{/* Additional details from JSON */}
								{Object.entries(details)
									.sort(([keyA], [keyB]) =>
										keyA.localeCompare(keyB)
									) // sort alphabetically
									.map(([key, value]) => {
										if (
											key === "images" ||
											key === "thumbnail" ||
											!value
										)
											return null;

										return (
											<p key={key}>
												<strong className="capitalize">
													{key
														.replace(
															/([A-Z])/g,
															" $1"
														)
														.trim()}
													:
												</strong>{" "}
												{typeof value === "string"
													? capitalizeWords(value)
													: String(value)}
											</p>
										);
									})}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="p-4 flex gap-3 border-t bg-white shadow-inner">
							<button className="btn-primary w-full">
								Inquire
							</button>
							<button
								className="btn-secondary w-full"
								onClick={onClose}
							>
								Close
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default DetailsDrawer;
