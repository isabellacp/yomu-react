import { useState, useEffect, useRef } from "react";

const useBookmarks = (key: string) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const initialRender = useRef(true);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem(key);

    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    } else {
      localStorage.setItem(key, JSON.stringify([]));
    }
    console.log(bookmarks);
  }, [key]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      localStorage.setItem(key, JSON.stringify(bookmarks));
    }
  }, [bookmarks, key]);

  const addBookmark = (id: string) => {
    if (!bookmarks.includes(id)) {
      setBookmarks([...bookmarks, id]);
    }
  };

  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarks.filter((bookmarkId) => bookmarkId !== id);
    setBookmarks(newBookmarks);
  };

  return [bookmarks, addBookmark, removeBookmark] as const;
};

export default useBookmarks;
