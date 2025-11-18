"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";

const Search = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const searchSubmitHandle: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!search) return;
    router.push(`/restaurants?search=${search}`);
  };

  return (
    <form className="flex gap-2" onSubmit={searchSubmitHandle}>
      <Input
        placeholder="Buscar restaurantes"
        className="border-none"
        value={search}
        onChange={changeHandle}
      ></Input>
      <Button size="icon" type="submit">
        <SearchIcon size={20}></SearchIcon>
      </Button>
    </form>
  );
};

export default Search;
