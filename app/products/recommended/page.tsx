import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";

const RecommendedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 20,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <>
      <Header></Header>
      <div className="p-5">
        <h2 className="font-semibold text-lg mb-6">Produtos Recomendados</h2>
        <div className="grid grid-cols-2 gap-6">
          {products.map((product) => (
            <ProductItem
              product={product}
              className="min-w-full max-w-full"
              key={product.id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedProducts;
