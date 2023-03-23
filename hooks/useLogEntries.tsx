import { useState, useEffect, useRef } from "react";

const useLogEntries = (key: any) => {
    const [LogEntries, setLogEntries] = useState<any[]>([]);
    const initialRender = useRef(true);

    useEffect(() => {
        const storedLogEntries = localStorage.getItem(key);

        if (storedLogEntries) {
            setLogEntries(JSON.parse(storedLogEntries));
        } else {
            localStorage.setItem(key, JSON.stringify([]));
        }
        console.log(LogEntries)

    }, [key]);

    useEffect(() => {

        if (initialRender.current) {
            initialRender.current = false;
        } else {
            localStorage.setItem(key, JSON.stringify(LogEntries));
        }
        console.trace()
        console.log(LogEntries)

    }, [LogEntries, key]);

    const addFavorite = (id: any) => {
        if (!LogEntries.includes(id)) {
            setLogEntries([...LogEntries, id]);
        }
    };

    const removeFavorite = (id: any) => {
        const newLogEntries = LogEntries.filter((favoriteId) => favoriteId !== id);
        setLogEntries(newLogEntries);
    };

    return [LogEntries, addFavorite, removeFavorite] as const;
};

export default useLogEntries;