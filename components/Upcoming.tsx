import React, { useEffect, useState } from "react";
import { Card, Row, Col, Divider, Tag, Typography } from "antd";
import Link from "next/link";

interface Manga {
  id: number;
  attributes: {
    canonicalTitle: string;
    volumeCount: number;
    nextRelease: string;
    posterImage: {
      small: string;
    };
    mangaType: string;
  };
}

const { Meta } = Card;

const Upcoming: React.FC = () => {
  const [mangaList, setMangaList] = useState<Manga[]>([]);

  useEffect(() => {
    const fetchManga = async () => {
      const response = await fetch("https://kitsu.io/api/edge/trending/manga");
      const data = await response.json();
      setMangaList(
        data.data
          .map((manga: any) => ({
            id: manga.id,
            attributes: {
              canonicalTitle: manga.attributes.canonicalTitle,
              episodeCount: manga.attributes.episodeCount,
              nextRelease: manga.attributes.nextRelease,
              posterImage: manga.attributes.posterImage,
              ageRating: manga.attributes.ageRating,
              mangaType: manga.attributes.mangaType,
            },
          }))
          .filter((manga: any) => manga.attributes.ageRating != "R")
      );
    };

    fetchManga();
  }, []);

  return (
    <div>
      <Typography.Title level={3}>Trending</Typography.Title>
      <Divider
        orientation="left"
        style={{
          marginTop: 0,
          height: "10px",
          borderColor: "#75d0c0",
          borderTopWidth: "6px",
        }}
      ></Divider>
      <Row gutter={[16, 16]}>
        {mangaList.map((manga) => (
          <Col xl={4} lg={4} md={8} sm={12} xs={24} key={manga.id}>
            <Link href="/manga/[id]" as={`/manga/${manga.id}`}>
              <Card
                cover={
                  <img
                    style={{ height: "20vh", objectFit: "cover" }}
                    alt={manga.attributes.canonicalTitle}
                    src={manga.attributes.posterImage.small}
                  />
                }
              >
                <Meta
                  title={`${manga.attributes.canonicalTitle}`}
                  description={
                    <Tag>{manga.attributes.mangaType.toLocaleUpperCase()}</Tag>
                  }
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Upcoming;
