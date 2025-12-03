"use client";

import Cart from "@/app/_components/cart";
import DeliveryInfo from "@/app/_components/delivery-info";
import DiscountBadge from "@/app/_components/discount-badge";
import ProductList from "@/app/_components/product-list";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import { CartContext } from "@/app/_context/cart";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { cn } from "@/app/_lib/utils";
import { Prisma } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { products, addProductToCart } = useContext(CartContext);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  const addToCart = ({ emptyCart }: { emptyCart?: boolean }) => {
    addProductToCart({ product, quantity, emptyCart });
    setIsCartOpen(true);
  };

  const handleAddToCartClick = () => {
    const hasDifferentRestaurantProduct = products.some(
      (cartProduct) => cartProduct.restaurantId !== product.restaurantId
    );

    if (hasDifferentRestaurantProduct) {
      return setIsConfirmationDialogOpen(true);
    }

    addToCart({
      emptyCart: false,
    });
  };

  const handleIncreaseQuantityClick = () =>
    setQuantity((currentState) => currentState + 1);

  const handleDecreaseQuantityClick = () =>
    setQuantity((currentState) => {
      if (currentState == 1) return currentState;
      else return currentState - 1;
    });

  return (
    <>
      <div>
        <div className="p-5 relative rounded-t-3xl z-50 mt-[-1.5rem] bg-white">
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
              <span className="w-4 text-center">{quantity}</span>
              <Button size="icon" onClick={handleIncreaseQuantityClick}>
                <ChevronRightIcon></ChevronRightIcon>
              </Button>
            </div>
          </div>

          <DeliveryInfo
            restaurant={{
              deliveryFee: product.restaurant.deliveryFee,
              deliveryTimeMinutes: product.restaurant.deliveryTimeMinutes,
            }}
          ></DeliveryInfo>

          <div className="space-y-1">
            <h3 className="font-semibold">Sobre</h3>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold px-5">Sucos</h3>
          <ProductList products={complementaryProducts}></ProductList>
        </div>

        <div className="mt-6 px-5 mb-6">
          <Button
            className="font-semibold w-full"
            onClick={handleAddToCartClick}
          >
            Adicionar à sacola
          </Button>
        </div>
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-[85vw] ">
          <SheetHeader className="text-left">
            <SheetTitle>Sacola</SheetTitle>
          </SheetHeader>
          <Cart></Cart>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Você só pode adicionar itens de um restaurante por vez
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deseja mesmo adicionar esse produto? Isso limpará sua sacola
              atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => addToCart({ emptyCart: true })}>
              Esvaziar sacola e adicionar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductDetails;
