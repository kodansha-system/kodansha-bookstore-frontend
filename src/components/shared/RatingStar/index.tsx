import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 20,
}) => {
  return (
    <div className="flex space-x-1">
      {[...Array(maxStars)].map((_, index) => (
        <Star
          className={`${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          key={index}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
};

export default RatingStars;
