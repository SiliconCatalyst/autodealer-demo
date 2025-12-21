import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { type Vehicle, parseVehicleDetails } from "../types/Vehicle";

import Footer from "../sections/Footer";

import DetailsDrawer from "../components/DetailsDrawer";

function Explore() {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const navigate = useNavigate();
	const firstMount = useRef(true);

	// Filter states
	const [selectedMake, setSelectedMake] = useState<string>(
		searchParams.get("make") || ""
	);
	const [selectedModel, setSelectedModel] = useState(
		searchParams.get("model") || ""
	);
	const [selectedCondition, setSelectedCondition] = useState(
		searchParams.get("condition") || ""
	);
	const [sortBy, setSortBy] = useState("year-newest");

	const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
		null
	);

	const [availableMakes, setAvailableMakes] = useState<string[]>([]);
	const [availableModels, setAvailableModels] = useState<string[]>([]);

	const normalize = (str: string) =>
		(str || "")
			.toLowerCase()
			.trim()
			.replace(/[\s\-_]+/g, " ");

	const getMakeLogo = (make: string): string => {
		return `/images/${make}.png`;
	};

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const response = await fetch("/api/vehicles");
				if (!response.ok) {
					throw new Error("Failed to fetch vehicles");
				}
				const data: Vehicle[] = await response.json();
				setVehicles(data);
				setFilteredVehicles(data);

				// Extract ONLY makes that exist in the database
				const makes = [
					...new Set(data.map((vehicle) => vehicle.make)),
				].sort();
				setAvailableMakes(makes);

				setLoading(false);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "An unknown error occurred"
				);
				setLoading(false);
			}
		};

		fetchVehicles();
	}, []);

	useEffect(() => {
		if (firstMount.current) {
			firstMount.current = false;
			return;
		}

		const params = new URLSearchParams(location.search); // Start with existing params

		// Update or remove filter params
		if (selectedMake) {
			params.set("make", selectedMake);
		} else {
			params.delete("make");
		}

		if (selectedModel) {
			params.set("model", selectedModel);
		} else {
			params.delete("model");
		}

		if (selectedCondition) {
			params.set("condition", selectedCondition);
		} else {
			params.delete("condition");
		}

		navigate(`/explore?${params.toString()}`, { replace: true });
	}, [selectedMake, selectedModel, selectedCondition, location.search]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const vehicleId = params.get("vehicleId");

		if (vehicleId && vehicles.length > 0) {
			const vehicle = vehicles.find((v) => v.id === Number(vehicleId));
			if (vehicle) {
				setSelectedVehicle(vehicle);
			}
		}
	}, [location.search, vehicles]);

	// Update available models when make is selected
	useEffect(() => {
		if (selectedMake) {
			const models = [
				...new Set(
					vehicles
						.filter((vehicle) => vehicle.make === selectedMake)
						.map((vehicle) => vehicle.model)
				),
			].sort();
			setAvailableModels(models);

			// Only reset if we have vehicles loaded AND the current selectedModel is invalid
			if (
				vehicles.length > 0 &&
				selectedModel &&
				!models.includes(selectedModel)
			) {
				setSelectedModel("");
			}
		} else {
			setAvailableModels([]);
			setSelectedModel("");
		}
	}, [selectedMake, vehicles]);

	// Filter and sort vehicles
	useEffect(() => {
		let filtered = [...vehicles];

		// Apply filters
		if (selectedMake) {
			filtered = filtered.filter(
				(vehicle) => vehicle.make === selectedMake
			);
		}
		if (selectedModel) {
			filtered = filtered.filter(
				(vehicle) => vehicle.model === selectedModel
			);
		}
		if (selectedCondition) {
			filtered = filtered.filter(
				(vehicle) =>
					normalize(vehicle.condition) ===
					normalize(selectedCondition)
			);
		}

		// Apply sorting
		switch (sortBy) {
			case "recent":
				filtered.sort((a, b) => {
					return (
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime()
					);
				});

				break;
			case "year-newest":
				filtered.sort((a, b) => b.year - a.year);
				break;
			case "year-oldest":
				filtered.sort((a, b) => a.year - b.year);
				break;
			case "price-highest":
				filtered.sort((a, b) => b.price - a.price);
				break;
			case "price-lowest":
				filtered.sort((a, b) => a.price - b.price);
				break;
			case "mileage-lowest":
				filtered.sort((a, b) => a.mileage - b.mileage);
				break;
			case "mileage-highest":
				filtered.sort((a, b) => b.mileage - a.mileage);
				break;
			default:
				break;
		}

		setFilteredVehicles(filtered);
	}, [vehicles, selectedMake, selectedModel, selectedCondition, sortBy]);

	useEffect(() => {
		if (selectedVehicle) {
			// Lock scroll
			document.body.style.overflow = "hidden";
		} else {
			// Restore scroll
			document.body.style.overflow = "";
		}
	});

	return (
		<>
			<div className="section-container mb-8">
				<div className="text-left lg:text-center mb-8">
					<h1 className="text-3xl font-bold sm:heading-primary">
						Explore Our Inventory
					</h1>
					<p className="heading-secondary">
						Find your perfect vehicle from our extensive collection
					</p>
				</div>

				{/* Brand Logo Filter */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold mb-4">
						Browse by Brand
					</h2>
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5  lg:grid-cols-7 gap-4">
						{availableMakes.map((make) => (
							<button
								key={make}
								onClick={() => {
									setSelectedMake(make);

									// Scroll to filter-bar section smoothly
									const carGrid =
										document.getElementById("filter-bar");
									if (carGrid) {
										carGrid.scrollIntoView({
											behavior: "smooth",
										});
									}
								}}
								className={`card p-4 flex flex-col items-center justify-center hover:bg-[var(--border-light)] ${
									selectedMake === make
										? "ring-2 ring-offset-2 ring-[var(--primary-orange-light)] hover:ring-2 hover:ring-offset-2 hover:ring-[var(--primary-orange)]"
										: ""
								}`}
							>
								<img
									src={getMakeLogo(make)}
									alt={make}
									loading="lazy"
									className="h-16 w-16 object-contain mb-2"
									onError={(e) => {
										// Fallback to text if image doesn't exist
										e.currentTarget.style.display = "none";
									}}
								/>
								<span className="text-sm font-medium text-[var(--text-dark)]">
									{make}
								</span>
							</button>
						))}
					</div>
					{selectedMake && (
						<button
							onClick={() => {
								setSelectedMake("");
								navigate("/explore");
							}}
							className="mt-4 px-1 text-[var(--primary-orange-light)] hover:text-[var(--primary-orange)] hover:bg-slate-300/75 hover:rounded-md hover:scale-105 text-md font-medium"
						>
							Clear brand filter
						</button>
					)}
				</div>

				{/* Filter Bar */}
				<div
					id="filter-bar"
					className={`stat-card p-6 mb-8 ${
						selectedMake ? "scroll-mt-20" : "scroll-mt-10"
					}`}
				>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-lg font-medium text-[var(--text-dark)] mb-2">
								Make
							</label>
							<select
								className="input-field cursor-pointer"
								value={selectedMake}
								onChange={(e) =>
									setSelectedMake(e.target.value)
								}
							>
								<option value="">All Makes</option>
								{availableMakes.map((make) => (
									<option key={make} value={make}>
										{make}
									</option>
								))}
							</select>
						</div>
						<div className="relative group inline-block">
							<label className="block text-lg font-medium text-[var(--text-dark)] mb-2">
								Model
							</label>
							<select
								className="input-field cursor-pointer"
								value={selectedModel}
								onChange={(e) =>
									setSelectedModel(e.target.value)
								}
								disabled={!selectedMake}
							>
								<option value="">All Models</option>
								{availableModels.map((model) => (
									<option key={model} value={model}>
										{model}
									</option>
								))}
							</select>

							{/* Tooltip when the dropdown is disabled */}
							{!selectedMake && (
								<div className="absolute top-full left-1/2 mt-2 -translate-x-1/2 bg-gray-800 text-white text-sm rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
									Please select a manufacturer first
									{/* Tooltip arrow */}
									<div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-gray-800" />
								</div>
							)}
						</div>
						<div>
							<label className="block text-lg font-medium text-[var(--text-dark)] mb-2">
								Condition
							</label>
							<select
								className="input-field cursor-pointer"
								value={selectedCondition}
								onChange={(e) =>
									setSelectedCondition(e.target.value)
								}
							>
								<option value="">Any Condition</option>
								<option value="new">New</option>
								<option value="used-like-new">
									Used Like New
								</option>
								<option value="fairly-used">Fairly Used</option>
							</select>
						</div>
					</div>
				</div>

				{/* Results */}
				<div className="flex justify-between items-center mb-6">
					<p className="text-gray-600">
						Showing {filteredVehicles.length} of {vehicles.length}{" "}
						vehicles
					</p>
					<select
						className="input-field w-48 cursor-pointer"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
					>
						<option value="recent">Recently Added</option>
						<option value="year-newest">Year (Newest)</option>
						<option value="year-oldest">Year (Oldest)</option>
						<option value="price-highest">Price (Highest)</option>
						<option value="price-lowest">Price (Lowest)</option>
						<option value="mileage-lowest">Mileage (Lowest)</option>
						<option value="mileage-highest">
							Mileage (Highest)
						</option>
					</select>
				</div>

				{/* Vehicle Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Vehicle Cards */}
					{filteredVehicles.map((vehicle) => {
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
							<div
								key={vehicle.id}
								className="card p-4 transition-transform ease-out duration-150"
							>
								<div className="bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden">
									<img
										src={`/api/vehicles/images/${firstImage}`}
										alt={`${vehicle.make} ${vehicle.model}`}
										className="w-full h-full object-cover"
										loading="lazy"
										onError={(e) => {
											e.currentTarget.style.display =
												"none";
											const parent =
												e.currentTarget.parentElement;
											if (parent) {
												parent.innerHTML = `<p class="text-gray-500">${vehicle.make} ${vehicle.model}</p>`;
											}
										}}
									/>
								</div>
								<div className="flex flex-row justify-between">
									<div>
										<h3 className="text-xl font-semibold mb-2">
											{vehicle.year} {vehicle.make}{" "}
											{vehicle.model}
										</h3>
										<p className="price-text mb-2">
											${vehicle.price.toLocaleString()}
										</p>
										<p
											className={`w-fit ${
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
									<div className="flex flex-col justify-center">
										<img
											src={`/images/${vehicle.make}.png`}
											className="w-14 h-auto"
											alt=""
											loading="lazy"
										/>
									</div>
								</div>
								<div className="flex space-x-2 mt-4">
									<button
										className="btn-primary flex-1"
										onClick={() => {
											const params = new URLSearchParams(
												location.search
											);
											params.set(
												"vehicleId",
												vehicle.id.toString()
											);
											navigate(
												`/explore?${params.toString()}`
											);
										}}
									>
										Details
									</button>
									<button className="btn-secondary flex-1">
										Contact
									</button>
								</div>
							</div>
						);
					})}
				</div>

				<DetailsDrawer
					vehicle={selectedVehicle}
					onClose={() => {
						setSelectedVehicle(null);
						const params = new URLSearchParams(location.search);
						params.delete("vehicleId");
						navigate(`/explore?${params.toString()}`, {
							replace: true,
						});
					}}
				/>

				<div>
					{loading ? (
						<p className="font-mono text-center py-8">
							Loading Vehicles...
						</p>
					) : error ? (
						<div className="font-mono text-center py-8 text-red-600">
							Error: {error}
						</div>
					) : vehicles.length === 0 ? (
						<div className="text-center py-8 text-red-600">
							No vehicles are Available
						</div>
					) : filteredVehicles.length === 0 ? (
						<div className="text-center py-8 text-[var(--text-light)]">
							No vehicles match your filter criteria
						</div>
					) : (
						<></>
					)}
				</div>
			</div>

			<div className="pt-8">
				<Footer />
			</div>
		</>
	);
}

export default Explore;
