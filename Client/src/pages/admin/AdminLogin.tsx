import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await fetch("/admin/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});

			if (!response.ok) {
				throw new Error("Invalid password");
			}

			const data = await response.json();

			// Store token in localStorage
			localStorage.setItem("adminToken", data.token);

			// Redirect to dashboard
			navigate("/admin/dashboard");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
			setPassword("");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center">
			<div className="card p-8 w-full max-w-md">
				<div className="text-center mb-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Admin Access
					</h1>
					<p className="text-gray-600">
						Enter your password to continue
					</p>
				</div>

				<form onSubmit={handleLogin}>
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="input-field"
							placeholder="Enter admin password"
							required
							disabled={loading}
						/>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
							<p className="text-red-600 text-sm">{error}</p>
						</div>
					)}

					<button
						type="submit"
						className="btn-primary w-full"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Access Dashboard"}
					</button>
				</form>

				<div className="mt-6 text-center">
					<a
						href="/"
						className="text-sm text-blue-600 hover:text-blue-800"
					>
						← Back to website
					</a>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
