import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { type Vehicle } from "../types/Vehicle";

interface Brand {
	make: string;
}

type SearchResult =
	| { type: "brand"; data: Brand }
	| { type: "vehicle"; data: Vehicle };

export default function SearchBar() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const desktopDropdownRef = useRef<HTMLDivElement>(null);
	const mobileDropdownRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	// Debounce timer
	const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

	useEffect(() => {
		if (debounceTimer) clearTimeout(debounceTimer);

		const timer = setTimeout(() => {
			if (query.trim() === "") {
				setResults([]);
				setIsDropdownOpen(false);
				return;
			}

			fetch(`/api/vehicles/search?q=${query}`)
				.then((res) => res.json())
				.then((data: SearchResult[]) => {
					setResults(data);
					setIsDropdownOpen(data.length > 0);
				})
				.catch((err) => console.error(err));
		}, 500);

		setDebounceTimer(timer);
	}, [query]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				desktopDropdownRef.current &&
				!desktopDropdownRef.current.contains(event.target as Node) &&
				mobileDropdownRef.current &&
				!mobileDropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<>
			<div
				className="hidden lg:block relative w-full max-w-xs xl:max-w-xl"
				ref={desktopDropdownRef}
			>
				<div className="flex items-center w-full h-9 bg-white rounded-full shadow-sm px-4">
					<div className="w-6 mr-4 text-[var(--text-dark)]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 387.2512 387.2512"
							fill="currentColor"
						>
							<path d="M154.3513,79.99998c-5.52295,0-10,4.47705-10,10s4.47705,10,10,10c27.01855,0,49,21.98145,49,49,0,5.52295,4.47705,10,10,10s10-4.47705,10-10c0-38.04688-30.95312-69-69-69Z" />
							<path d="M374.2985,342.947l-101.53595-101.53583c19.79187-25.35455,31.58875-57.25409,31.58875-91.91119C304.3513,66.93339,237.41789-.00002,154.8513-.00002S5.3513,66.93339,5.3513,149.49998s66.93341,149.5,149.5,149.5c29.14325,0,56.33289-8.34753,79.32489-22.76953l103.41949,103.41937c10.13519,10.13519,26.56757,10.13519,36.70276,0l.00006-.00006c10.13519-10.13519,10.13519-26.56757,0-36.70276ZM48.3513,149.49998c0-58.81836,47.6817-106.5,106.5-106.5s106.5,47.68164,106.5,106.5-47.6817,106.5-106.5,106.5-106.5-47.6817-106.5-106.5Z" />
						</svg>
					</div>

					<div className="bg-[var(--text-dark)] w-[2px] h-[calc(100%-12px)] rounded-full mr-4"></div>

					<input
						type="text"
						placeholder="Search"
						className="flex-1 outline-none bg-transparent text-[var(--text-dark)] font-semibold placeholder-[var(--text-light)]"
						value={query}
						onChange={(e) => setQuery(e.target.value.trim())}
						onFocus={() => setIsDropdownOpen(results.length > 0)}
					/>
				</div>

				{/* Dropdown */}
				{isDropdownOpen && (
					<ul className="absolute bg-white shadow rounded w-full mt-2">
						{/* Brands header */}
						{results.some((r) => r.type === "brand") && (
							<li className="px-4 py-1 text-sm font-semibold text-gray-500">
								Brands
							</li>
						)}

						{/* Brand results */}
						{results
							.filter((r) => r.type === "brand")
							.map((result) => (
								<li
									key={result.data.make}
									className="flex justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
									onClick={() => {
										navigate(
											`/explore?make=${encodeURIComponent(
												result.data.make
											)}`
										);
										setIsDropdownOpen(false);
										setQuery("");
										setResults([]);
									}}
								>
									<p className="font-semibold ml-4">
										{result.data.make}
									</p>
									<div className="w-6 h-6">
										<img
											src={`/images/${result.data.make}.png`}
											alt=""
											loading="lazy"
										/>
									</div>
								</li>
							))}

						{/* Vehicles header */}
						{results.some((r) => r.type === "vehicle") && (
							<li className="px-4 py-1 text-sm font-semibold text-gray-500">
								Vehicles
							</li>
						)}

						{/* Vehicle results */}
						{results
							.filter((r) => r.type === "vehicle")
							.map((result) => (
								<li
									key={result.data.id}
									className="flex justify-between px-4 py-2 hover:bg-gray-200 cursor-pointer"
									onClick={() => {
										navigate(
											`/explore?make=${encodeURIComponent(
												result.data.make
											)}&model=${encodeURIComponent(
												result.data.model
											)}&year=${encodeURIComponent(
												result.data.year
											)}&vehicleId=${result.data.id}`
										);
										setIsDropdownOpen(false);
										setQuery("");
										setResults([]);
									}}
								>
									<p className="text-md ml-4">
										{result.data.year} {result.data.make}{" "}
										{result.data.model}
									</p>
									<div className="w-6 h-6">
										<img
											src={`/images/${result.data.make}.png`}
											alt=""
											loading="lazy"
										/>
									</div>
								</li>
							))}
					</ul>
				)}
			</div>

			{/* Mobile Search Pill */}
			<div
				ref={mobileDropdownRef}
				className="flex lg:hidden justify-center md:justify-start w-full ml-[10%] sm:ml-[15%]"
			>
				{!isPopupOpen && (
					<div
						className="flex items-center bg-white rounded-full shadow-sm px-4 py-2 cursor-pointer sm:w-72 md:w-36"
						onClick={() => setIsPopupOpen(true)}
					>
						<div className="w-5 h-5 text-[var(--text-dark)] mr-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 387.2512 387.2512"
								fill="currentColor"
							>
								<path d="M154.3513,79.99998c-5.52295,0-10,4.47705-10,10s4.47705,10,10,10c27.01855,0,49,21.98145,49,49,0,5.52295,4.47705,10,10,10s10-4.47705,10-10c0-38.04688-30.95312-69-69-69Z" />
								<path d="M374.2985,342.947l-101.53595-101.53583c19.79187-25.35455,31.58875-57.25409,31.58875-91.91119C304.3513,66.93339,237.41789-.00002,154.8513-.00002S5.3513,66.93339,5.3513,149.49998s66.93341,149.5,149.5,149.5c29.14325,0,56.33289-8.34753,79.32489-22.76953l103.41949,103.41937c10.13519,10.13519,26.56757,10.13519,36.70276,0l.00006-.00006c10.13519-10.13519,10.13519-26.56757,0-36.70276ZM48.3513,149.49998c0-58.81836,47.6817-106.5,106.5-106.5s106.5,47.68164,106.5,106.5-47.6817,106.5-106.5,106.5-106.5-47.6817-106.5-106.5Z" />
							</svg>
						</div>

						<div className="bg-[var(--text-dark)] w-[2px] h-6 rounded-full mr-2"></div>

						<p className="text-[var(--text-light)] font-semibold">
							Search
						</p>
					</div>
				)}

				{/* --- Mobile popup overlay --- */}
				<div
					className={`fixed inset-0 flex flex-col items-center transition-opacity duration-300 lg:hidden px-4 ${
						isPopupOpen
							? "opacity-100 z-[100] pointer-events-auto"
							: "opacity-0 z-[-1] pointer-events-none"
					}`}
				>
					{/* invisible clickable backdrop behind content to close the menu*/}
					{isPopupOpen && (
						<div
							className="absolute inset-0 bg-black/10 backdrop-blur-sm pointer-events-auto"
							onClick={() => {
								setIsPopupOpen(false);
								setIsDropdownOpen(false);
								setQuery("");
								setResults([]);
							}}
						></div>
					)}

					{/* Search bar */}
					<div className="z-20 w-full pt-16">
						<div className="flex items-center w-full  h-12 bg-white rounded-full shadow-md px-4">
							<div className="flex items-center w-[calc(100%-1rem)] h-12">
								<div className="w-6 mr-4 text-[var(--text-dark)] flex-shrink-0">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 387.2512 387.2512"
										fill="currentColor"
									>
										<path d="M154.3513,79.99998c-5.52295,0-10,4.47705-10,10s4.47705,10,10,10c27.01855,0,49,21.98145,49,49,0,5.52295,4.47705,10,10,10s10-4.47705,10-10c0-38.04688-30.95312-69-69-69Z" />
										<path d="M374.2985,342.947l-101.53595-101.53583c19.79187-25.35455,31.58875-57.25409,31.58875-91.91119C304.3513,66.93339,237.41789-.00002,154.8513-.00002S5.3513,66.93339,5.3513,149.49998s66.93341,149.5,149.5,149.5c29.14325,0,56.33289-8.34753,79.32489-22.76953l103.41949,103.41937c10.13519,10.13519,26.56757,10.13519,36.70276,0l.00006-.00006c10.13519-10.13519,10.13519-26.56757,0-36.70276ZM48.3513,149.49998c0-58.81836,47.6817-106.5,106.5-106.5s106.5,47.68164,106.5,106.5-47.6817,106.5-106.5,106.5-106.5-47.6817-106.5-106.5Z" />
									</svg>
								</div>

								<div className="bg-[var(--text-dark)] w-[2px] h-[calc(100%-12px)] rounded-full mr-4 flex-shrink-0"></div>

								<input
									type="text"
									placeholder="Search"
									className="outline-none bg-transparent text-[var(--text-dark)] font-semibold placeholder-[var(--text-light)] w-full"
									value={query}
									onChange={(e) =>
										setQuery(e.target.value.trim())
									}
									onFocus={() =>
										setIsDropdownOpen(results.length > 0)
									}
									autoFocus={isPopupOpen}
								/>
							</div>

							<button
								onClick={() => {
									setIsPopupOpen(false);
									setQuery("");
									setResults([]);
								}}
							>
								<svg
									className="h-6 w-6"
									stroke="currentColor"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>

					{isDropdownOpen && (
						<ul className="z-30 w-full max-h-[60vh] overflow-y-auto p-4 mt-4 bg-white rounded-xl shadow-lg shadow-black/40">
							{/* Brands header */}
							{results.some((r) => r.type === "brand") && (
								<li className="px-4 py-1 text-sm font-semibold text-gray-500">
									Brands
								</li>
							)}

							{/* Brand results */}
							{results
								.filter((r) => r.type === "brand")
								.map((result) => (
									<li
										key={result.data.make}
										className="flex justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											navigate(
												`/explore?make=${encodeURIComponent(
													result.data.make
												)}`
											);
											setIsPopupOpen(false);
											setIsDropdownOpen(false);
											setQuery("");
											setResults([]);
										}}
									>
										<p className="font-semibold ml-4">
											{result.data.make}
										</p>
										<div className="w-6 h-6">
											<img
												src={`/images/${result.data.make}.png`}
												alt=""
												loading="lazy"
											/>
										</div>
									</li>
								))}

							{/* Vehicles header */}
							{results.some((r) => r.type === "vehicle") && (
								<li className="px-4 py-1 text-sm font-semibold text-gray-500">
									Vehicles
								</li>
							)}

							{/* Vehicle results */}
							{results
								.filter((r) => r.type === "vehicle")
								.map((result) => (
									<li
										key={result.data.id}
										className="flex justify-between px-4 py-2 hover:bg-gray-200 cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											navigate(
												`/explore?make=${encodeURIComponent(
													result.data.make
												)}&model=${encodeURIComponent(
													result.data.model
												)}&year=${encodeURIComponent(
													result.data.year
												)}&vehicleId=${result.data.id}`
											);
											setIsPopupOpen(false);
											setIsDropdownOpen(false);
											setQuery("");
											setResults([]);
										}}
									>
										<p className="text-md ml-4">
											{result.data.year}{" "}
											{result.data.make}{" "}
											{result.data.model}
										</p>
										<div className="w-6 h-6">
											<img
												src={`/images/${result.data.make}.png`}
												alt=""
												loading="lazy"
											/>
										</div>
									</li>
								))}
						</ul>
					)}
				</div>
			</div>
		</>
	);
}
