import Header from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";
import { db } from "@/app/_lib/prisma";

const RecommendedRestaurants = async () => {
  const restaurants = await db.restaurant.findMany({});

  return (
    <>
      <Header></Header>
      <div className="p-5">
        <h2 className="font-semibold text-lg mb-6">
          Restaurantes Recomendados
        </h2>
        <div className="flex flex-col gap-6 w-full">
          {restaurants.map((restaurant) => (
            <RestaurantItem
              restaurant={restaurant}
              className="min-w-full max-w-full"
              key={restaurant.id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedRestaurants;
