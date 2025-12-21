import { useEffect, useState } from "react";

interface AddVehicleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

interface CustomField {
	id: string;
	field: string;
	value: string;
}

const AddVehicleModal = ({
	isOpen,
	onClose,
	onSuccess,
}: AddVehicleModalProps) => {
	const [formData, setFormData] = useState({
		make: "",
		model: "",
		year: new Date().getFullYear(),
		price: "",
		mileage: "",
		condition: "New",
	});
	const [thumbnail, setThumbnail] = useState<string | null>(null);
	const [images, setImages] = useState<File[]>([]);
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);
	const [customFields, setCustomFields] = useState<CustomField[]>([]);
	const [uploading, setUploading] = useState(false);

	// Generate and clean up preview URLs whenever `images` changes
	useEffect(() => {
		const urls = images.map((file) => URL.createObjectURL(file));
		setPreviewUrls(urls);

		// Cleanup old object URLs
		return () => {
			urls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [images]);

	if (!isOpen) return null;

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

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setImages(Array.from(e.target.files));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);

		const token = localStorage.getItem("adminToken");
		if (!token) {
			alert("Not authenticated. Please login again.");
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			let imageFilenames: string[] = [];
			let thumbnailUuid: string | null = null;

			// Upload images first
			if (images.length > 0) {
				const imageFormData = new FormData();
				images.forEach((image) => {
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
					imageFilenames = await uploadResponse.json();
				} else {
					throw new Error("Image upload failed");
				}

				// Map the selected thumbnail (original filename) to the uploaded UUID filename
				if (thumbnail && imageFilenames.length === images.length) {
					const thumbIndex = images.findIndex(
						(file) => file.name === thumbnail
					);
					if (thumbIndex !== -1) {
						thumbnailUuid = imageFilenames[thumbIndex];
					}
				}

				// Default to the first image if no thumbnail explicitly chosen
				if (!thumbnailUuid && imageFilenames.length > 0) {
					thumbnailUuid = imageFilenames[0];
				}
			}

			// Build detailsJson from uploaded images and custom fields
			const detailsJson: any = {
				images: imageFilenames,
				thumbnail: thumbnailUuid || imageFilenames[0] || null,
			};

			// Add custom fields (only non-empty)
			customFields.forEach((cf) => {
				if (cf.field.trim() && cf.value.trim()) {
					detailsJson[cf.field.trim()] = cf.value.trim();
				}
			});

			const capitalizeWords = (str: string) =>
				str
					.split(" ")
					.map(
						(word) =>
							word.charAt(0).toUpperCase() +
							word.slice(1).toLowerCase()
					)
					.join(" ");

			// Create vehicle
			const vehicleData = {
				make: capitalizeWords(formData.make),
				model: capitalizeWords(formData.model),
				year: formData.year,
				price: parseFloat(formData.price),
				mileage: parseInt(formData.mileage),
				status: "AVAILABLE",
				condition: formData.condition.toUpperCase(),
				detailsJson: JSON.stringify(detailsJson),
			};

			if (!formData.make || !formData.model || !formData.price) {
				alert("Please fill in all required fields");
				return;
			}

			const response = await fetch("/admin/api/vehicles", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(vehicleData),
			});

			if (response.ok) {
				alert("Vehicle added successfully!");
				onSuccess();
				onClose();
				// Reset form
				setFormData({
					make: "",
					model: "",
					year: new Date().getFullYear(),
					price: "",
					mileage: "",
					condition: "New",
				});
				setImages([]);
				setCustomFields([]);
			} else {
				throw new Error("Failed to add vehicle");
			}
		} catch (err) {
			alert(err instanceof Error ? err.message : "Error adding vehicle");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold">Add New Vehicle</h2>
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
								Required Information
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
										min="1900"
										max={new Date().getFullYear() + 1}
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
										min="0"
										step="0.01"
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 mt-4">
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
										min="0"
										required
									/>
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

							<div className="mt-4">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Images
								</label>
								<input
									type="file"
									multiple
									accept="image/*"
									onChange={handleImageChange}
									className="input-field file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
									style={{ color: "transparent" }}
								/>
							</div>
						</div>

						{/* Image Preview */}
						{previewUrls.length > 0 && (
							<div className="mt-3">
								<p className="text-sm font-medium text-gray-700 mb-2">
									Selected Images ({images.length})
								</p>
								<div className="grid grid-cols-4 gap-2">
									{previewUrls.map((url, index) => {
										const img = images[index];
										if (!img) return null; // guard against out of sync state
										const isThumbnail =
											thumbnail === img.name;

										return (
											<div
												key={index}
												className={`relative group cursor-pointer rounded overflow-hidden border-2 transition-all ${
													isThumbnail
														? "ring-2 ring-offset-2 ring-yellow-500 shadow-lg scale-[1.02]"
														: "border-transparent hover:border-gray-300"
												}`}
												onClick={() =>
													setThumbnail(img.name)
												}
											>
												<img
													src={url}
													alt={`Preview ${index + 1}`}
													className="w-full h-20 object-cover rounded"
												/>

												{/* Star icon indicator */}
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														setThumbnail(img.name);
													}}
													className={`absolute top-1 left-1 p-1 rounded-full transition ${
														isThumbnail
															? "text-yellow-400"
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

												{/* Remove button */}
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														const newImages =
															images.filter(
																(_, i) =>
																	i !== index
															);
														setImages(newImages);
														if (
															thumbnail ===
															img.name
														)
															setThumbnail(null);
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

						{/* Custom Fields Section */}
						<div className="border-b pb-4">
							<div className="flex justify-between items-center mb-3">
								<h3 className="text-lg font-semibold">
									Additional Information (Optional)
								</h3>
								<button
									type="button"
									onClick={addCustomField}
									className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
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
											d="M12 4v16m8-8H4"
										/>
									</svg>
									<span>Add Field</span>
								</button>
							</div>

							{customFields.length === 0 ? (
								<p className="text-sm text-gray-500 italic">
									Click "Add Field" to include additional
									details like Engine Size, Transmission,
									Color, etc.
								</p>
							) : (
								<div className="space-y-3">
									{customFields.map((cf) => (
										<div
											key={cf.id}
											className="flex gap-2 items-start"
										>
											<div className="flex-1">
												<input
													type="text"
													placeholder="Field name (e.g., Transmission)"
													value={cf.field}
													onChange={(e) =>
														updateCustomField(
															cf.id,
															"field",
															e.target.value
														)
													}
													className="input-field"
												/>
											</div>
											<div className="flex-1">
												<input
													type="text"
													placeholder="Value (e.g., Manual)"
													value={cf.value}
													onChange={(e) =>
														updateCustomField(
															cf.id,
															"value",
															e.target.value
														)
													}
													className="input-field"
												/>
											</div>
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
							)}
						</div>

						<div className="flex space-x-4 pt-4">
							<button
								type="submit"
								disabled={uploading}
								className="btn-primary flex-1"
							>
								{uploading ? "Adding..." : "Add Vehicle"}
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

export default AddVehicleModal;
