import Image from "next/image";
import { CartContext, CartProduct } from "../_context/cart";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import { cn } from "../_lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import { useContext } from "react";

interface CartItemProps {
  cartProduct: CartProduct;
}

const CartItem = ({ cartProduct }: CartItemProps) => {
  const {
    decreaseProductQuantity,
    increaseProductQuantity,
    removeProductFromCart,
  } = useContext(CartContext);

  const handleDecreaseProductQuantity = () => {
    decreaseProductQuantity(cartProduct.id);
  };

  const handleRemoveProductFromCart = () => {
    removeProductFromCart(cartProduct.id);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20">
          <Image
            src={cartProduct.imageUrl}
            alt={cartProduct.name}
            fill
            className="rounded-lg object-cover"
          ></Image>
        </div>
        <div className="space-y-1">
          <h3 className="text-xs">{cartProduct.name}</h3>
          <div className="flex items-center gap-1">
            <h4 className="text-sm font-semibold">
              {formatCurrency(
                calculateProductTotalPrice(cartProduct) * cartProduct.quantity
              )}
            </h4>
            {cartProduct.discountPercentage > 0 && (
              <h4 className="text-xs text-muted-foreground line-through">
                {formatCurrency(
                  Number(cartProduct.price) * cartProduct.quantity
                )}
              </h4>
            )}
          </div>
          <div className="flex gap-3 items-center">
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "border border-muted-foreground border-solid h-8 w-8",
                cartProduct.quantity === 1 && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleDecreaseProductQuantity}
              disabled={cartProduct.quantity === 1}
            >
              <ChevronLeftIcon size={18}></ChevronLeftIcon>
            </Button>
            <span className="w-4 text-sm text-center">
              {cartProduct.quantity}
            </span>
            <Button
              size="icon"
              className="h-8 w-8"
              onClick={() => increaseProductQuantity(cartProduct.id)}
            >
              <ChevronRightIcon></ChevronRightIcon>
            </Button>
          </div>
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="border border-muted-foreground border-solid h-8 w-8"
        onClick={handleRemoveProductFromCart}
      >
        <TrashIcon> size={18}</TrashIcon>
      </Button>
    </div>
  );
};

export default CartItem;
