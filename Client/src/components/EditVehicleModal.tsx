import { useState, useEffect } from "react";
import { type Vehicle, parseVehicleDetails } from "../types/Vehicle";

interface EditVehicleModalProps {
	vehicle: Vehicle | null;
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

interface CustomField {
	id: string;
	field: string;
	value: string;
}

const EditVehicleModal = ({
	vehicle,
	isOpen,
	onClose,
	onSuccess,
}: EditVehicleModalProps) => {
	const [formData, setFormData] = useState({
		make: "",
		model: "",
		year: new Date().getFullYear(),
		price: "",
		mileage: "",
		status: "AVAILABLE",
		condition: "New",
	});
	const [customFields, setCustomFields] = useState<CustomField[]>([]);
	const [existingImages, setExistingImages] = useState<string[]>([]);
	const [newImages, setNewImages] = useState<File[]>([]);
	const [thumbnail, setThumbnail] = useState<string>("");
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		if (vehicle) {
			setFormData({
				make: vehicle.make,
				model: vehicle.model,
				year: vehicle.year,
				price: vehicle.price.toString(),
				mileage: vehicle.mileage.toString(),
				status: vehicle.status,
				condition: vehicle.condition,
			});

			// Parse existing custom fields and images
			const details = parseVehicleDetails(vehicle.detailsJson);
			setExistingImages(details.images || []);

			// ✅ Set thumbnail if it exists
			if (details.thumbnail) {
				setThumbnail(details.thumbnail);
			} else if (details.images && details.images.length > 0) {
				setThumbnail(details.images[0]); // fallback
			}

			// Parse custom fields (excluding built-in keys)
			const fields: CustomField[] = [];
			Object.entries(details).forEach(([key, value]) => {
				if (
					key !== "images" &&
					key !== "condition" &&
					key !== "thumbnail" && // ✅ exclude thumbnail from editable custom fields
					value
				) {
					fields.push({
						id: Date.now().toString() + key,
						field: key,
						value: String(value),
					});
				}
			});
			setCustomFields(fields);
		}
	}, [vehicle]);

	if (!isOpen || !vehicle) return null;

	const addCustomField = () => {
		setCustomFields([
			...customFields,
			{ id: Date.now().toString(), field: "", value: "" },
		]);
	};

	const updateCustomField = (
		id: string,
		key: "field" | "value",
		newValue: string
	) => {
		setCustomFields(
			customFields.map((cf) =>
				cf.id === id ? { ...cf, [key]: newValue } : cf
			)
		);
	};

	const removeCustomField = (id: string) => {
		setCustomFields(customFields.filter((cf) => cf.id !== id));
	};

	const removeExistingImage = (filename: string) => {
		setExistingImages(existingImages.filter((img) => img !== filename));
	};

	const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setNewImages(Array.from(e.target.files));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);

		try {
			const token = localStorage.getItem("adminToken");
			let uploadedImageFilenames: string[] = [];
			let thumbnailUuid: string | null = null;

			// Upload new images if any
			if (newImages.length > 0) {
				const imageFormData = new FormData();
				newImages.forEach((image) => {
					imageFormData.append("files", image);
				});

				const uploadResponse = await fetch(
					"/admin/api/vehicles/images/upload",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
						},
						body: imageFormData,
					}
				);

				if (uploadResponse.ok) {
					uploadedImageFilenames = await uploadResponse.json();
				} else {
					throw new Error("Image upload failed");
				}
			}

			// Combine existing and newly uploaded image filenames
			const allImages = [...existingImages, ...uploadedImageFilenames];

			// Determine which image should be the thumbnail
			if (thumbnail) {
				// Case 1: Admin picked an existing image
				if (existingImages.includes(thumbnail)) {
					thumbnailUuid = thumbnail;
				}
				// Case 2: Admin picked one of the new images
				else {
					const thumbIndex = newImages.findIndex(
						(file) => file.name === thumbnail
					);
					if (
						thumbIndex !== -1 &&
						uploadedImageFilenames[thumbIndex]
					) {
						thumbnailUuid = uploadedImageFilenames[thumbIndex];
					}
				}
			}

			// Case 3: No thumbnail explicitly chosen
			if (!thumbnailUuid && allImages.length > 0) {
				thumbnailUuid = allImages[0];
			}

			// Build detailsJson
			const detailsJson: any = {
				images: allImages,
				thumbnail: thumbnailUuid || allImages[0] || null,
				condition: formData.condition,
			};

			// Add any custom fields
			customFields.forEach((cf) => {
				if (cf.field.trim() && cf.value.trim()) {
					detailsJson[cf.field.trim()] = cf.value.trim();
				}
			});

			// Update vehicle
			const vehicleData = {
				make: formData.make,
				model: formData.model,
				year: formData.year,
				price: parseFloat(formData.price),
				mileage: parseInt(formData.mileage),
				status: formData.status,
				condition: formData.condition,
				detailsJson: JSON.stringify(detailsJson),
			};

			const response = await fetch(`/admin/api/vehicles/${vehicle.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(vehicleData),
			});

			if (response.ok) {
				alert("Vehicle updated successfully!");
				onSuccess();
				onClose();
				setNewImages([]);
			} else {
				throw new Error("Failed to update vehicle");
			}
		} catch (err) {
			alert(
				err instanceof Error ? err.message : "Error updating vehicle"
			);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold">Edit Vehicle</h2>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700"
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Required Fields */}
						<div className="border-b pb-4">
							<h3 className="text-lg font-semibold mb-3">
								Vehicle Information
							</h3>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Make *
									</label>
									<input
										type="text"
										value={formData.make}
										onChange={(e) =>
											setFormData({
												...formData,
												make: e.target.value,
											})
										}
										className="input-field"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Model *
									</label>
									<input
										type="text"
										value={formData.model}
										onChange={(e) =>
											setFormData({
												...formData,
												model: e.target.value,
											})
										}
										className="input-field"
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 mt-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Year *
									</label>
									<input
										type="number"
										value={formData.year}
										onChange={(e) =>
											setFormData({
												...formData,
												year: parseInt(e.target.value),
											})
										}
										className="input-field"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Price *
									</label>
									<input
										type="number"
										value={formData.price}
										onChange={(e) =>
											setFormData({
												...formData,
												price: e.target.value,
											})
										}
										className="input-field"
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-4 mt-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Mileage *
									</label>
									<input
										type="number"
										value={formData.mileage}
										onChange={(e) =>
											setFormData({
												...formData,
												mileage: e.target.value,
											})
										}
										className="input-field"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Status *
									</label>
									<select
										value={formData.status}
										onChange={(e) =>
											setFormData({
												...formData,
												status: e.target.value,
											})
										}
										className="input-field"
									>
										<option value="AVAILABLE">
											Available
										</option>
										<option value="SOLD">Sold</option>
										<option value="PENDING">Pending</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Condition *
									</label>
									<select
										value={formData.condition}
										onChange={(e) =>
											setFormData({
												...formData,
												condition: e.target.value,
											})
										}
										className="input-field"
									>
										<option value="New">New</option>
										<option value="Excellent">
											Excellent
										</option>
										<option value="Fair">Fair</option>
										<option value="Good">Good</option>
									</select>
								</div>
							</div>
						</div>

						{/* Add New Images */}
						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Images
							</label>
							<input
								type="file"
								multiple
								accept="image/*"
								onChange={handleNewImageChange}
								className="input-field file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
								style={{ color: "transparent" }}
							/>
						</div>

						{/* Existing Images */}
						{existingImages.length > 0 && (
							<div className="border-b pb-4">
								<h3 className="text-lg font-semibold mb-3">
									Current Images
								</h3>
								<div className="grid grid-cols-4 gap-2">
									{existingImages.map((img, index) => {
										if (!img) return null; // gurad against out of sync state
										const isThumbnail = thumbnail === img;
										return (
											<div
												key={index}
												className={`relative group cursor-pointer rounded overflow-hidden border-2 transition-all ${
													isThumbnail
														? "ring-2 ring-offset-2 ring-yellow-500 shadow-lg scale-[1.02]"
														: "border-transparent hover:border-gray-300"
												}`}
												onClick={() =>
													setThumbnail(img)
												}
											>
												<img
													src={`/api/vehicles/images/${img}`}
													alt={`Vehicle ${index + 1}`}
													className="w-full h-20 object-cover rounded"
												/>

												{/* Star Icon Indicator */}
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														setThumbnail(img);
													}}
													className={`absolute top-1 left-1 p-1 rounded-full transition ${
														isThumbnail
															? "text-yellow-500"
															: "text-gray-400 hover:text-yellow-300"
													}`}
													title={
														isThumbnail
															? "This is the thumbnail"
															: "Set as thumbnail"
													}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill={
															isThumbnail
																? "currentColor"
																: "none"
														}
														viewBox="0 0 24 24"
														strokeWidth={1.8}
														stroke="currentColor"
														className="w-5 h-5 drop-shadow-sm"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.401a.563.563 0 01.318.986l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.563.563 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0l-4.725 2.885a.563.563 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.318-.986l5.518-.401a.563.563 0 00.475-.345L11.48 3.5z"
														/>
													</svg>
												</button>

												{/* Remove Button */}
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														removeExistingImage(
															img
														);
													}}
													className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M6 18L18 6M6 6l12 12"
														/>
													</svg>
												</button>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Custom Fields */}
						<div className="border-b pb-4">
							<div className="flex justify-between items-center mb-3">
								<h3 className="text-lg font-semibold">
									Additional Information
								</h3>
								<button
									type="button"
									onClick={addCustomField}
									className="text-blue-600 hover:text-blue-800 text-sm font-medium"
								>
									+ Add Field
								</button>
							</div>

							<div className="space-y-3">
								{customFields.map((cf) => (
									<div
										key={cf.id}
										className="flex gap-2 items-start"
									>
										<input
											type="text"
											placeholder="Field name"
											value={cf.field}
											onChange={(e) =>
												updateCustomField(
													cf.id,
													"field",
													e.target.value
												)
											}
											className="input-field flex-1"
										/>
										<input
											type="text"
											placeholder="Value"
											value={cf.value}
											onChange={(e) =>
												updateCustomField(
													cf.id,
													"value",
													e.target.value
												)
											}
											className="input-field flex-1"
										/>
										<button
											type="button"
											onClick={() =>
												removeCustomField(cf.id)
											}
											className="text-red-600 hover:text-red-800 p-2"
										>
											<svg
												className="w-5 h-5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									</div>
								))}
							</div>
						</div>

						<div className="flex space-x-4 pt-4">
							<button
								type="submit"
								disabled={uploading}
								className="btn-primary flex-1"
							>
								{uploading ? "Updating..." : "Update Vehicle"}
							</button>
							<button
								type="button"
								onClick={onClose}
								className="btn-secondary flex-1"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditVehicleModal;
