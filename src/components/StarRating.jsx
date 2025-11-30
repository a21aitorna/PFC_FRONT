import { Star } from "lucide-react";

export default function StarRating({ rating = 0, setRating, size = 28, readonly = false }) {

  const handleClick = (value) => {
    if (!readonly && setRating) {
      setRating(value);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const full = rating >= star;
        const half = rating >= star - 0.5 && rating < star;

        return (
          <div
            data-testid="bookRating"
            key={star}
            className={`relative w-6 h-6 ${readonly ? "" : "cursor-pointer"}`}
          >
            {/* MITAD IZQUIERDA */}
            {!readonly && (
              <div
                className="absolute inset-y-0 left-0 w-1/2 z-10"
                onClick={() => handleClick(star - 0.5)}
              />
            )}

            {/* MITAD DERECHA */}
            {!readonly && (
              <div
                className="absolute inset-y-0 right-0 w-1/2 z-10"
                onClick={() => handleClick(star)}
              />
            )}

            {/* ICONO VISUAL */}
            <Star
              size={size}
              className={
                full
                  ? "fill-yellow-400 text-yellow-400"
                  : half
                  ? "fill-yellow-400 text-yellow-400 clip-half-star"
                  : "text-gray-300"
              }
            />
          </div>
        );
      })}
    </div>
  );
}
