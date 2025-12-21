import { useState, useEffect } from "react";

export default function DemoCard({
	initialOpen = true,
	position = "bottom-right",
}: {
	initialOpen?: boolean;
	position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}) {
	const [open, setOpen] = useState(initialOpen);
	const [minimized, setMinimized] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mq.matches);
		const handler = () => setPrefersReducedMotion(mq.matches);
		mq.addEventListener?.("change", handler);
		return () => mq.removeEventListener?.("change", handler);
	}, []);

	if (!open) return null;

	const posClasses: Record<string, string> = {
		"bottom-right": "bottom-10 right-10",
		"bottom-left": "bottom-10 left-10",
		"top-right": "top-10 right-10",
		"top-left": "top-10 left-10",
	};

	return (
		<div
			className={`fixed ${
				posClasses[position] || "bottom-6 right-6"
			} z-50 pointer-events-none`}
		>
			<div
				className={`pointer-events-auto max-w-sm w-64 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg p-3 text-lg leading-tight select-auto transition-transform ${
					prefersReducedMotion ? "transition-none" : "duration-200"
				}`}
				role="status"
				aria-live="polite"
			>
				<div className="flex items-start gap-2">
					<div className="flex-1">
						<div className="font-semibold text-gray-900">
							Demo Site —{" "}
							<span className="underline text-red-500">
								Not Real
							</span>
						</div>
						{!minimized && (
							<div className="mt-1 text-gray-600 text-sm">
								This website is a demo and does not represent a
								real business or process real data.
							</div>
						)}
					</div>
					<button
						aria-label={minimized ? "Show message" : "Hide message"}
						title={minimized ? "Show" : "Hide"}
						onClick={() => setMinimized(!minimized)}
						className="-mr-1 inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
					>
						{minimized ? "+" : "–"}
					</button>
					<button
						aria-label="Close demo card"
						title="Close"
						onClick={() => setOpen(false)}
						className="inline-flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"
					>
						×
					</button>
				</div>
			</div>
		</div>
	);
}
