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
    console.log(LogEntries);
  }, [key]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      localStorage.setItem(key, JSON.stringify(LogEntries));
    }
  }, [LogEntries, key]);

  const addBookmark = (id: any) => {
    if (!LogEntries.includes(id)) {
      setLogEntries([...LogEntries, id]);
    }
  };

  const removeBookmark = (id: any) => {
    const newLogEntries = LogEntries.filter((bookmarkId) => bookmarkId !== id);
    setLogEntries(newLogEntries);
  };

  return [LogEntries, addBookmark, removeBookmark] as const;
};

export default useLogEntries;
