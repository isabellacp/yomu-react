import { Layout, Input, theme, Card } from "antd";
import React from "react";
import Upcoming from "@/components/Upcoming";
import BookmarkMangas from "@/components/Bookmarks";
import BasicLayout from "./layout";
import useBookmarks from "@/hooks/useBookmarks";
import useLogEntries from "@/hooks/useLogEntries";

const { Content } = Layout;

const App: React.FC = () => {
  const [bookmarks, addBookmark, removeBookmark] = useBookmarks("bookmarks");
  const [logEntries, addLogEntry, removeLogEntry] = useLogEntries("logEntries");

  return (
    <BasicLayout
      sidebar
      bookmarks={bookmarks}
      addBookmarks={addBookmark}
      removeBookmarks={removeBookmark}
      logEntries={logEntries}
      addLogEntry={addLogEntry}
      removeLogEntry={removeLogEntry}
    >
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <BookmarkMangas
          bookmarks={bookmarks}
          removeBookmarks={removeBookmark}
        ></BookmarkMangas>
        <Upcoming></Upcoming>
      </Content>
    </BasicLayout>
  );
};

export default App;
