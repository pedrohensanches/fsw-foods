import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";

interface CategoriesPageProps {
  params: {
    id: string;
  };
}

const CategoriesPage = async ({ params: { id } }: CategoriesPageProps) => {
  const category = await db.category.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return (
    <>
      <Header></Header>
      <div className="p-5">
        <h2 className="font-semibold text-lg mb-6">{category?.name}</h2>
        <div className="grid grid-cols-2 gap-6">
          {category?.products.map((product) => (
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

export default CategoriesPage;
