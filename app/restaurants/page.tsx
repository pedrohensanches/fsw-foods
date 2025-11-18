"use client";

import { Restaurant } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchForRestaurants } from "./_actions/search";
import Header from "../_components/header";
import RestaurantItem from "../_components/restaurant-item";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("search");

  useEffect(() => {
    const fetchRestaurantes = async () => {
      if (!query) return;
      const restaurants = await searchForRestaurants(query);
      setRestaurants(restaurants);
    };

    fetchRestaurantes();
  }, [query]);

  if (!query) return notFound();

  return (
    <>
      <Header></Header>
      <div className="p-5">
        <h2 className="font-semibold text-lg mb-6">Restaurantes encontrados</h2>
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

export default Restaurants;
