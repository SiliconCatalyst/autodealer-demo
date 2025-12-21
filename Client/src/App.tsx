import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Latest from "./pages/Latest";
import Explore from "./pages/Explore";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Navbar from "./sections/Navbar";

import DemoCard from "./components/DemoCard";

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

function App() {
	return (
		<Router>
			<Routes>
				{/* Public routes with navbar */}
				<Route
					path="/*"
					element={
						<div className="flex flex-col min-h-screen">
							<DemoCard />
							<Navbar />
							<main>
								<Routes>
									<Route path="/" element={<Latest />} />
									<Route
										path="/latest"
										element={<Latest />}
									/>
									<Route
										path="/explore"
										element={<Explore />}
									/>
									<Route path="/about" element={<About />} />
									<Route
										path="/contact"
										element={<Contact />}
									/>
								</Routes>
							</main>
						</div>
					}
				/>

				{/* Admin routes without navbar */}
				<Route
					path="/admin"
					element={
						<Suspense
							fallback={
								<div className="min-h-screen flex items-center justify-center">
									Loading...
								</div>
							}
						>
							<AdminLogin />
						</Suspense>
					}
				/>
				<Route
					path="/admin/dashboard"
					element={
						<Suspense
							fallback={
								<div className="min-h-screen flex items-center justify-center">
									Loading...
								</div>
							}
						>
							<AdminDashboard />
						</Suspense>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
