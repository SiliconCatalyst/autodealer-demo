export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
  condition: string;
  detailsJson: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleDetails {
  images?: string[];
  thumbnail?: string;
}

// Helper to parse detailsJson
export const parseVehicleDetails = (detailsJson: string): VehicleDetails => {
  try {
    return JSON.parse(detailsJson);
  } catch {
    return {};
  }
};