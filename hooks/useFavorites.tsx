import { useState, useEffect, useRef } from "react";

const useFavorites = (key: string) => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const initialRender = useRef(true);

    useEffect(() => {
        const storedFavorites = localStorage.getItem(key);

        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        } else {
            localStorage.setItem(key, JSON.stringify([]));
        }
        console.log(favorites)

    }, [key]);

    useEffect(() => {

        if (initialRender.current) {
            initialRender.current = false;
        } else {
            localStorage.setItem(key, JSON.stringify(favorites));
        }
        console.trace()
        console.log(favorites)

    }, [favorites, key]);

    const addFavorite = (id: string) => {
        if (!favorites.includes(id)) {
            setFavorites([...favorites, id]);
        }
    };

    const removeFavorite = (id: string) => {
        const newFavorites = favorites.filter((favoriteId) => favoriteId !== id);
        setFavorites(newFavorites);
    };

    return [favorites, addFavorite, removeFavorite] as const;
};

export default useFavorites;