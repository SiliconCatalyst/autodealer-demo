
// Check if the JWT is expired
export function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    let exp = decoded.exp;

    // Convert to ms if it's in seconds (10 digits)
    if (exp < 9999999999) {
      exp = exp * 1000;
    }

    return Date.now() >= exp;
  } catch {
    return true; // treat malformed tokens as expired
  }
}


// Handle session expiration gracefully
export function handleSessionExpired(formData?: any) {
	if (formData) {
		localStorage.setItem("savedVehicleFormData", JSON.stringify(formData));
	}

	alert("Your session has expired. Your progress has been saved, and you’ll be logged out shortly. This is done to protect the security of the Admin Dashboard.");

	localStorage.removeItem("adminToken");

	setTimeout(() => {
		window.location.href = "/admin";
	}, 2000);
}

// Auth-aware fetch wrapper
export async function authFetch(
	url: string,
	options: RequestInit = {},
	formDataToSave?: any
) {
	const token = localStorage.getItem("adminToken");

	if (!token || isTokenExpired(token)) {
		handleSessionExpired(formDataToSave);
		throw new Error("Session expired");
	}

	const response = await fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.status === 401 || response.status === 403) {
		handleSessionExpired(formDataToSave);
		throw new Error("Unauthorized");
	}

	return response;
}
