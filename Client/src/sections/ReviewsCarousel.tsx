import { useState, useEffect } from "react";

interface Review {
	id: string;
	review: string;
}

export default function ReviewsCarousel() {
	const [reviews, setReviews] = useState<Review[]>([]);

	useEffect(() => {
		fetch("/reviews.json")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch");
				return res.json();
			})
			.then((data) => {
				setReviews(data);
			})
			.catch((err) => console.error("Error loading reviews:", err));
	}, []);

	if (reviews.length === 0) return null;

	// Duplicate reviews for seamless loop
	const duplicatedReviews = [...reviews, ...reviews, ...reviews];

	return (
		<div className="relative overflow-hidden">
			<style
				dangerouslySetInnerHTML={{
					__html: `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    
    .animate-scroll {
      animation: scroll ${reviews.length * 12}s linear infinite;
    }
    
    .animate-scroll:hover {
      animation-play-state: paused;
    }
  `,
				}}
			/>
			<div className="relative overflow-hidden w-full">
				<div className="flex animate-scroll gap-6 w-max">
					{duplicatedReviews.map((review, index) => (
						<div
							key={`${review.id}-${index}`}
							className="relative card flex-shrink-0 w-[250px] sm:w-80 p-6 border border-gray-400 mb-8 mt-1 text-sm sm:text-base"
						>
							<p className="text-[var(--text-medium)] leading-relaxed mb-4">
								"{review.review}"
							</p>
							<p className="absolute bottom-2 text-[var(--text-dark)] font-semibold text-sm">
								— {review.id}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
