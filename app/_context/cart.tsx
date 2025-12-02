"use client";

import { Prisma } from "@prisma/client";
import { createContext, ReactNode, useMemo, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          id: true;
          deliveryFee: true;
          deliveryTimeMinutes: true;
        };
      };
    };
  }> {
  quantity: number;
}

interface ICartContext {
  products: CartProduct[];
  subtotalPrice: number;
  totalPrice: number;
  totalDiscounts: number;
  addProductToCart: (
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            deliveryFee: true;
          };
        };
      };
    }>,
    quantity: number
  ) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  subtotalPrice: 0,
  totalPrice: 0,
  totalDiscounts: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const subtotalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity;
    }, 0);
  }, [products]);

  const totalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + calculateProductTotalPrice(product) * product.quantity;
    }, 0);
  }, [products]);

  const totalDiscounts = subtotalPrice - totalPrice;

  const addProductToCart = (
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            deliveryFee: true;
          };
        };
      };
    }>,
    quantity: number
  ) => {
    // // VERIFICAR SE O PRODUTO JÁ ESTÁ NO CARRINHO
    // const isProductAlreadyOnCart = products.some(
    //   (cartProduct) => cartProduct.id === product.id
    // );

    // // SE ELE ESTIVER, AUMENTAR A SUA QUANTIDADE
    // if (isProductAlreadyOnCart) {
    //   return setProducts((prev) =>
    //     prev.map((cartProduct) => {
    //       if (cartProduct.id === product.id) {
    //         return {
    //           ...cartProduct,
    //           quantity: cartProduct.quantity + quantity,
    //         };
    //       }

    //       return cartProduct;
    //     })
    //   );
    // }

    // // SE NÃO, ADICIONÁ-LO COM A QUANTIDADE RECEBIDA
    // setProducts((prev) => [...prev, { ...product, quantity: quantity }]);

    setProducts((prev) => {
      const productOnCart = prev.find((x) => x.id === product.id);

      if (productOnCart) {
        return prev.map((prod) =>
          prod.id === product.id
            ? { ...prod, quantity: prod.quantity + quantity }
            : prod
        );
      } else return [...prev, { ...product, quantity }];
    });
  };

  const decreaseProductQuantity = (productId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId && prod.quantity > 1)
          return { ...prod, quantity: prod.quantity - 1 };
        else return prod;
      })
    );
  };

  const increaseProductQuantity = (productId: string) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === productId ? { ...prod, quantity: prod.quantity + 1 } : prod
      )
    );
  };

  const removeProductFromCart = (productId: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id != productId));
  };

  return (
    <CartContext.Provider
      value={{
        products,
        subtotalPrice,
        totalPrice,
        totalDiscounts,
        addProductToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
