import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import ProductImage from "./_components/product-image";
import ProductDetails from "./_components/product-details";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: true,
    },
  });

  if (!product) return notFound();

  const sucos = await db.product.findMany({
    where: {
      category: {
        name: "Sucos",
      },
      restaurant: {
        id: product.restaurantId,
      },
    },
    include: {
      restaurant: true,
    },
  });

  return (
    <div>
      <ProductImage
        product={{
          name: product.name,
          imageUrl: product.imageUrl,
        }}
      />

      <ProductDetails
        product={product}
        complementaryProducts={sucos}
      ></ProductDetails>
    </div>
  );
};

export default ProductPage;
