import { useEffect, useState } from "react";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";

import { List, Layout, Card, Button, message, Space, Row } from "antd";
import Manga from "@/types/Manga";
import BasicLayout from "./layout";
import { useRouter } from "next/router";
import useBookmarks from "@/hooks/useBookmarks";
import useLogEntries from "@/hooks/useLogEntries";
import Link from "next/link";

const SearchResults: React.FC = () => {
  const [favorites, addFavorite, removeFavorite] = useBookmarks("favorites");
  const [bookmarks, addBookmark, removeBookmark] = useBookmarks("bookmarks");
  const [logEntries, addLogEntry, removeLogEntry] = useLogEntries("logEntries");

  const [results, setResults] = useState<Manga[]>([]);
  const router = useRouter();

  const { query } = router.query;

  useEffect(() => {
    if (!query) {
      return;
    }
    const fetchData = async () => {
      const response = await fetch(
        `https://kitsu.io/api/edge/manga?filter[text]=${query}`
      );
      const data = await response.json();
      setResults(data.data);
    };

    fetchData();
  }, [query]);

  const handleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      removeBookmark(id);
      message.success("removed from your bookshelf!");
    } else {
      addBookmark(id);
      message.success("Added to your bookshelf!");
    }
  };
  const handleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      removeFavorite(id);
      message.success("Removed from favorites!");
    } else {
      addFavorite(id);
      message.success("Added to favorites!");
    }
  };
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
      <Layout
        style={{ padding: "0 24px", minHeight: 280, background: "white" }}
      >
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 2,
            xl: 4,
            xxl: 6,
          }}
          dataSource={results}
          renderItem={(item: Manga) => (
            <List.Item>
              <Card
                cover={
                  <img
                    alt={item.attributes.canonicalTitle}
                    src={
                      item.attributes.posterImage
                        ? item.attributes.posterImage.small
                          ? item.attributes.posterImage.small
                          : item.attributes.posterImage.original
                        : "/default-image.png"
                    }
                    style={{ objectFit: "cover", height: 300 }}
                  />
                }
                actions={[
                  <Button
                    type="text"
                    icon={
                      bookmarks.includes(item.id) ? (
                        <DeleteOutlined />
                      ) : (
                        <PlusCircleOutlined />
                      )
                    }
                    onClick={() => handleBookmark(item.id)}
                  >
                    {bookmarks.includes(item.id)
                      ? "Remove from shelf"
                      : "Add to shelf"}
                  </Button>,
                  <Link href="/manga/[id]" as={`/manga/${item.id}`}>
                    <Button type="text">See more</Button>
                  </Link>,
                ]}
              >
                <Card.Meta
                  title={
                    <Row justify={"space-between"}>
                      <span>{item.attributes.canonicalTitle}</span>{" "}
                      <Button
                        type="dashed"
                        shape="circle"
                        icon={
                          favorites.includes(item.id) ? (
                            <HeartFilled />
                          ) : (
                            <HeartOutlined />
                          )
                        }
                        onClick={() => handleFavorite(item.id)}
                      />
                    </Row>
                  }
                  description={item.attributes.synopsis?.slice(0, 150)}
                />
              </Card>
            </List.Item>
          )}
        />
      </Layout>
    </BasicLayout>
  );
};

export default SearchResults;
