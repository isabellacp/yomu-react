import Rate from "@/types/Rate";
import { useState, useEffect, useRef } from "react";

const useRatings = (key: string) => {
  const [ratings, setRatings] = useState<Rate[]>([]);
  const initialRender = useRef(true);

  useEffect(() => {
    const storedRatings = localStorage.getItem(key);

    if (storedRatings) {
      setRatings(JSON.parse(storedRatings));
    } else {
      localStorage.setItem(key, JSON.stringify([]));
    }
  }, [key]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      localStorage.setItem(key, JSON.stringify(ratings));
    }
  }, [ratings, key]);

  const addRate = (rate: Rate) => {
    if (ratings.find((x) => x.id == rate.id)) {
      const newRatings = ratings.filter((rating) => rating.id !== rate.id);
      setRatings([...newRatings, rate]);
    } else {
      setRatings([...ratings, rate]);
    }
  };

  const removeRate = (id: string) => {
    const newRatings = ratings.filter((rate) => rate.id !== id);
    setRatings(newRatings);
  };

  return [ratings, addRate, removeRate] as const;
};

export default useRatings;
