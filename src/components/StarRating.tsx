import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

export default function StarRating({
  value,
  onChange,
  size = "md",
  readOnly = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const displayValue = hoverValue || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`transition-transform ${
            !readOnly && "cursor-pointer hover:scale-110"
          } ${readOnly && "cursor-default"}`}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(0)}
          onClick={() => !readOnly && onChange?.(star)}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              star <= displayValue
                ? "fill-primary-400 text-primary-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
