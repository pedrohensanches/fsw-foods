"use client";

import DiscountBadge from "@/app/_components/discount-badge";
import ProductList from "@/app/_components/product-list";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { cn } from "@/app/_lib/utils";
import { Prisma } from "@prisma/client";
import {
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TimerIcon,
} from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetails = ({
  product,
  complementaryProducts,
}: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantityClick = () =>
    setQuantity((currentState) => currentState + 1);

  const handleDecreaseQuantityClick = () =>
    setQuantity((currentState) => {
      if (currentState == 1) return currentState;
      else return currentState - 1;
    });

  const getDeliveryFeeElement = (): ReactNode => {
    if (Number(product.restaurant.deliveryFee) > 0)
      return (
        <p className="text-sm font-semibold">
          {formatCurrency(Number(product.restaurant.deliveryFee))}
        </p>
      );
    else return <p className="text-sm font-semibold">Grátis</p>;
  };

  return (
    <div>
      <div className="p-5">
        <div className="flex items-center gap-[0.375rem]">
          <div className="relative h-6 w-6">
            <Image
              src={product.restaurant.imageUrl}
              alt={product.restaurant.name}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {product.restaurant.name}
          </p>
        </div>

        <h1 className="mb-2 mt-1 text-xl font-semibold">{product.name}</h1>

        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {formatCurrency(calculateProductTotalPrice(product))}
              </h2>
              {product.discountPercentage > 0 && (
                <DiscountBadge product={product}></DiscountBadge>
              )}
            </div>

            {product.discountPercentage > 0 && (
              <p className="text-muted-foreground text-sm">
                De: {formatCurrency(Number(product.price))}
              </p>
            )}
          </div>

          <div className="flex gap-3 items-center">
            <Button
              size="icon"
              variant="ghost"
              // className={`border border-muted-foreground border-solid ${
              //   quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
              // }`}
              className={cn(
                "border border-muted-foreground border-solid",
                quantity === 1 && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleDecreaseQuantityClick}
              disabled={quantity === 1}
            >
              <ChevronLeftIcon></ChevronLeftIcon>
            </Button>
            <span className="w-3 text-center">{quantity}</span>
            <Button size="icon" onClick={handleIncreaseQuantityClick}>
              <ChevronRightIcon></ChevronRightIcon>
            </Button>
          </div>
        </div>

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
              {product.restaurant.deliveryTimeMinutes} min
            </p>
          </div>
        </Card>

        <div className="space-y-1">
          <h3 className="font-semibold">Sobre</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold px-5">Sucos</h3>
        <ProductList products={complementaryProducts}></ProductList>
      </div>
    </div>
  );
};

export default ProductDetails;
