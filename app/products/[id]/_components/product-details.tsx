"use client";

import DiscountBadge from "@/app/_components/discount-badge";
import { Button } from "@/app/_components/ui/button";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { cn } from "@/app/_lib/utils";
import { Prisma } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantityClick = () =>
    setQuantity((currentState) => currentState + 1);

  const handleDecreaseQuantityClick = () =>
    setQuantity((currentState) => {
      if (currentState == 1) return currentState;
      else return currentState - 1;
    });

  return (
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
    </div>
  );
};

export default ProductDetails;
