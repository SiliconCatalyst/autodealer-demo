import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Vehicle } from "../../types/Vehicle";

import AddVehicleModal from "../../components/AddVehicleModal";
import EditVehicleModal from "../../components/EditVehicleModal";

const AdminDashboard = () => {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
	const [showEditModal, setShowEditModal] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		// Check if token exists
		const token = localStorage.getItem("adminToken");
		if (!token) {
			navigate("/admin");
			return;
		}

		fetchVehicles();
	}, [navigate]);

	const fetchVehicles = async () => {
		try {
			const response = await fetch("/api/vehicles");
			const data = await response.json();
			setVehicles(data);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching vehicles:", err);
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("adminToken");
		navigate("/admin");
	};

	const handleDelete = async (id: number) => {
		if (!confirm("Are you sure you want to delete this vehicle?")) return;

		const token = localStorage.getItem("adminToken");

		try {
			const response = await fetch(`/admin/api/vehicles/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				setVehicles(vehicles.filter((v) => v.id !== id));
				alert("Vehicle deleted successfully");
			} else {
				throw new Error("Failed to delete vehicle");
			}
		} catch (err) {
			alert(
				err instanceof Error ? err.message : "Error deleting vehicle"
			);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	const handleEdit = (vehicle: Vehicle) => {
		setEditingVehicle(vehicle);
		setShowEditModal(true);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Admin Dashboard
						</h1>
						<p className="text-gray-600 mt-1">
							Manage your vehicle inventory
						</p>
					</div>
					<button onClick={handleLogout} className="btn-secondary">
						Logout
					</button>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="stat-card p-6">
						<h3 className="text-lg font-semibold text-gray-700">
							Total Vehicles
						</h3>
						<p className="text-3xl font-bold text-blue-600">
							{vehicles.length}
						</p>
					</div>
					<div className="stat-card p-6">
						<h3 className="text-lg font-semibold text-gray-700">
							Available
						</h3>
						<p className="text-3xl font-bold text-green-600">
							{
								vehicles.filter((v) => v.status === "AVAILABLE")
									.length
							}
						</p>
					</div>
					<div className="stat-card p-6">
						<h3 className="text-lg font-semibold text-gray-700">
							Sold
						</h3>
						<p className="text-3xl font-bold text-purple-600">
							{vehicles.filter((v) => v.status === "SOLD").length}
						</p>
					</div>
					<div className="stat-card p-6">
						<h3 className="text-lg font-semibold text-gray-700">
							Pending
						</h3>
						<p className="text-3xl font-bold text-orange-600">
							{
								vehicles.filter((v) => v.status === "PENDING")
									.length
							}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex space-x-4 mb-8">
					<button
						onClick={() => setShowAddModal(true)}
						className="btn-primary"
					>
						+ Add New Vehicle
					</button>
				</div>

				{/* Vehicle Management Table */}
				<div className="table-container p-6">
					<h2 className="text-xl font-bold text-gray-900 mb-4">
						Manage Vehicles
					</h2>
					<div className="overflow-x-auto">
						<table className="w-full table-auto">
							<thead>
								<tr className="border-b">
									<th className="text-left py-3 px-4">
										Vehicle
									</th>
									<th className="text-left py-3 px-4">
										Year
									</th>
									<th className="text-left py-3 px-4">
										Price
									</th>
									<th className="text-left py-3 px-4">
										Status
									</th>
									<th className="text-left py-3 px-4">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{vehicles
									.sort((a, b) =>
										a.make.localeCompare(b.make)
									)
									.map((vehicle) => (
										<tr
											key={vehicle.id}
											className="border-b hover:bg-gray-50 text-lg"
										>
											<td className="py-3 px-4">
												<div className="flex items-center gap-6">
													<div className="w-10 h-10 flex items-center">
														<img
															src={`/images/${vehicle.make}.png`}
															alt=""
														/>
													</div>
													<p className="font-semibold">
														{vehicle.make}{" "}
														{vehicle.model}
													</p>
												</div>
											</td>
											<td className="py-3 px-4">
												{vehicle.year}
											</td>
											<td className="py-3 px-4 font-semibold text-blue-600">
												$
												{vehicle.price.toLocaleString()}
											</td>
											<td className="py-3 px-4">
												<span
													className={`px-2 py-1 rounded-full text-sm ${
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
												</span>
											</td>
											<td className="py-3 px-4">
												<div className="flex space-x-2">
													<button
														onClick={() =>
															handleEdit(vehicle)
														}
														className="text-blue-600 hover:text-blue-800"
													>
														Edit
													</button>
													<button
														onClick={() =>
															handleDelete(
																vehicle.id
															)
														}
														className="text-red-600 hover:text-red-800"
													>
														Delete
													</button>
												</div>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<AddVehicleModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSuccess={fetchVehicles}
			/>

			<EditVehicleModal
				vehicle={editingVehicle}
				isOpen={showEditModal}
				onClose={() => {
					setShowEditModal(false);
					setEditingVehicle(null);
				}}
				onSuccess={fetchVehicles}
			/>
		</div>
	);
};

export default AdminDashboard;
