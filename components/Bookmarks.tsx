import React, { useEffect, useState } from "react";
import { Card, Row, Col, Divider, Tag, Empty, Typography } from "antd";
import Manga from "@/types/Manga";
import Link from "next/link";

const { Meta } = Card;

const BookmarkMangas: React.FC<{
  bookmarks: string[];
  removeBookmarks: any;
}> = ({ bookmarks, removeBookmarks }) => {
  const [bookmarkMangas, setBookmarkMangas] = useState<Manga[]>([]);

  useEffect(() => {
    if (bookmarks.length > 0) {
      const fetchManga = async () => {
        const idsString = bookmarks.join(",");
        const response = await fetch(
          `https://kitsu.io/api/edge/manga?filter[id]=${idsString}`
        );
        const data = await response.json();
        const mangas = data.data.map((manga: any) => ({
          id: manga.id,
          attributes: {
            canonicalTitle: manga.attributes.canonicalTitle,
            volumeCount: manga.attributes.volumeCount,
            nextRelease: manga.attributes.nextRelease,
            posterImage: manga.attributes.posterImage,
            mangaType: manga.attributes.mangaType,
          },
        }));
        setBookmarkMangas(mangas);
      };
      fetchManga();
    } else {
      setBookmarkMangas([]);
    }
  }, [bookmarks]);

  return (
    <div style={{ marginBottom: "40px" }}>
      <Typography.Title level={3}>My Bookshelf</Typography.Title>
      <Divider
        orientation="left"
        style={{
          marginTop: 0,
          height: "10px",
          borderColor: "#75d0c0",
          borderTopWidth: "6px",
        }}
      ></Divider>
      <Row
        className="customScrollBar"
        style={{ overflowY: "hidden", paddingBottom: 15 }}
        gutter={[16, 16]}
        wrap={false}
      >
        {bookmarkMangas.length !== 0 ? (
          bookmarkMangas.map((manga) => (
            <Col xxl={4} xl={8} lg={8} md={8} sm={12} xs={24} key={manga.id}>
              <Link href="/manga/[id]" as={`/manga/${manga.id}`}>
                <Card
                  cover={
                    <img
                      style={{ objectFit: "cover", height: "30vh" }}
                      alt={manga.attributes.canonicalTitle}
                      src={manga.attributes.posterImage.original}
                    />
                  }
                  actions={[
                    <span onClick={() => removeBookmarks(manga.id)}>
                      Remove bookmark
                    </span>,
                  ]}
                >
                  <Meta
                    title={`${manga.attributes.canonicalTitle}`}
                    description={
                      <Tag>
                        {manga.attributes.mangaType.toLocaleUpperCase()}
                      </Tag>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default BookmarkMangas;
