import { BikeIcon, TimerIcon } from "lucide-react";
import { Card } from "./ui/card";
import { ReactNode } from "react";
import { formatCurrency } from "../_helpers/price";
import { Restaurant } from "@prisma/client";

interface DeliveryInfoPros {
  restaurant: Pick<Restaurant, "deliveryFee" | "deliveryTimeMinutes">;
}

const DeliveryInfo = ({ restaurant }: DeliveryInfoPros) => {
  const getDeliveryFeeElement = (): ReactNode => {
    if (Number(restaurant.deliveryFee) > 0)
      return (
        <p className="text-sm font-semibold">
          {formatCurrency(Number(restaurant.deliveryFee))}
        </p>
      );
    else return <p className="text-sm font-semibold">Grátis</p>;
  };

  return (
    <Card className="flex justify-around py-4 my-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs ">Taxa de entrega</span>
          <BikeIcon size={14}></BikeIcon>
        </div>
        {getDeliveryFeeElement()}
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs ">Tempo</span>
          <TimerIcon size={14}></TimerIcon>
        </div>
        <p className="text-sm font-semibold">
          {restaurant.deliveryTimeMinutes} min
        </p>
      </div>
    </Card>
  );
};

export default DeliveryInfo;
