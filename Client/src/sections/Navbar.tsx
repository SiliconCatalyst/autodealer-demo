import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import SearchBar from "../components/SearchBar";

const Navbar = () => {
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			// Only close if the menu is open and click happened outside both the menu and the button
			if (
				isMobileMenuOpen &&
				menuRef.current &&
				!menuRef.current.contains(target) &&
				buttonRef.current &&
				!buttonRef.current.contains(target)
			) {
				closeMobileMenu();
			}
		};

		// Using 'pointerdown' ensures it catches taps on mobile browsers too
		document.addEventListener("pointerdown", handleClickOutside);
		return () =>
			document.removeEventListener("pointerdown", handleClickOutside);
	}, [isMobileMenuOpen]);

	const navItems = [
		{ path: "/latest", name: "Latest", label: "Latest Arrivals" },
		{ path: "/explore", name: "Explore", label: "Explore Inventory" },
		{ path: "/about", name: "About", label: "About Us" },
		{ path: "/contact", name: "Contact", label: "Contact" },
	];

	const isActive = (path: string) => {
		return (
			location.pathname === path ||
			(path === "/latest" && location.pathname === "/")
		);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<nav className="sticky top-0 h-auto w-full bg-[var(--primary-orange-dark)] px-4 lg:px-12 py-4 z-50 shadow-md shadow-black/40">
			<div className="relative flex items-center justify-between w-full px-4">
				{/* Mobile: hamburger button */}
				<div className="md:hidden order-1 flex-shrink-0">
					<button
						ref={buttonRef}
						type="button"
						onClick={toggleMobileMenu}
						className="p-2 rounded-md text-white hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
						aria-expanded={isMobileMenuOpen}
					>
						<span className="sr-only">
							{isMobileMenuOpen
								? "Close main menu"
								: "Open main menu"}
						</span>
						{isMobileMenuOpen ? (
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
						) : (
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
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						)}
					</button>
				</div>

				{/* Search bar */}
				<div className="order-2 flex-1 w-full max-w-xs xl:max-w-xl flex justify-center md:justify-start">
					<SearchBar />
				</div>

				{/* Desktop Nav */}
				<div className="hidden md:flex order-3 mx-6 items-baseline space-x-4">
					{navItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={
								isActive(item.path)
									? "nav-link-active"
									: "nav-link"
							}
						>
							{item.label}
						</Link>
					))}
				</div>

				{/* Logo */}
				<div className="order-4 flex justify-center items-center ml-2">
					<Link
						to="/"
						onClick={closeMobileMenu}
						style={{ color: "white" }}
					>
						<img
							src="/images/extras/Placeholder car logo.svg"
							alt="Logo"
							className="w-28 h-auto md:w-36"
						/>
					</Link>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMobileMenuOpen && (
				<div
					ref={menuRef}
					className="absolute top-full left-0 w-full md:hidden bg-[var(--accent-light)] shadow-md shadow-black/40"
				>
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{navItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={closeMobileMenu}
								className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
									isActive(item.path)
										? "nav-link-active"
										: "nav-link"
								}`}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
