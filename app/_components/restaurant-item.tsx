import { Restaurant } from "@prisma/client";
import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import Link from "next/link";

interface RestaurantItemProps {
  restaurant: Restaurant;
}

const RestaurantItem = ({ restaurant }: RestaurantItemProps) => {
  return (
    <Link
      className="min-w-[266px] max-w-[266px]"
      href={`/restaurants/${restaurant.id}`}
    >
      <div className="w-full space-y-3">
        <div className="w-full h-[136px] relative">
          <Image
            className="object-cover rounded-lg"
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
          />

          <div className="absolute left-2 top-2 flex items-center gap-[2px] rounded-full px-2 py-[2px] bg-white">
            <StarIcon
              size={12}
              className="fill-yellow-500 text-yellow-400"
            ></StarIcon>
            <span className="text-xs font-semibold">5,0</span>
          </div>

          <Button className="absolute top-2 right-2 bg-gray-700 rounded-full h-7 w-7">
            <HeartIcon className="h-fit w-fit fill-white" size={12}></HeartIcon>
          </Button>
        </div>
        <div>
          <h3 className="text-sm font-semibold">{restaurant.name}</h3>
          <div className="flex gap-3">
            <div className="flex gap-1 items-center">
              <BikeIcon className="text-primary" size={14} />
              <span className="text-muted-foreground text-xs">
                {Number(restaurant.deliveryFee) === 0
                  ? "Entrega grátis"
                  : formatCurrency(Number(restaurant.deliveryFee))}
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <TimerIcon className="text-primary" size={14} />
              <span className="text-muted-foreground text-xs">
                {restaurant.deliveryTimeMinutes} min
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantItem;
