import React, { useState, useEffect } from "react";
import {
  Layout,
  Tabs,
  List,
  Avatar,
  Space,
  Divider,
  Typography,
  Rate,
  Row,
  Col,
} from "antd";
import { BookOutlined, VideoCameraOutlined } from "@ant-design/icons";
import useFavorites from "@/hooks/useFavorites";
import Manga from "@/types/Manga";
import Link from "next/link";

const { Sider, Content } = Layout;

interface Media {
  id: number;
  type: string;
  attributes: {
    canonicalTitle: string;
    synopsis: string;
    posterImage: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

const Favorites: React.FC<{
  favorites: string[];
  addFavorite: any;
  rates: any;
  addRates: any;
}> = ({ favorites, addFavorite, rates, addRates }) => {
  const [media, setMedia] = useState<Media[]>([]);

  const [favoriteMangas, setFavoriteMangas] = useState<Manga[]>([]);

  useEffect(() => {
    if (favorites.length > 0) {
      const fetchManga = async () => {
        const idsString = favorites.join(",");
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
        setFavoriteMangas(mangas);
      };
      fetchManga();
    } else {
      setFavoriteMangas([]);
    }
  }, [favorites]);

  return (
    <div>
      <Typography.Title style={{ marginTop: 30 }} level={3}>
        Favorites
      </Typography.Title>
      <Divider
        orientation="left"
        style={{
          marginTop: 0,
          height: "10px",
          borderColor: "#75d0c0",
          borderTopWidth: "6px",
          marginBottom: "0px",
        }}
      ></Divider>
      <List
        itemLayout="vertical"
        dataSource={favoriteMangas}
        renderItem={(m) => (
          <List.Item>
            <List.Item>
              <div>
                <Row justify={"space-between"} wrap={false}>
                  <Col>
                    <Space>
                      <Avatar src={m.attributes.posterImage.small} />

                      <Link href="/manga/[id]" as={`/manga/${m.id}`}>
                        {m.attributes.canonicalTitle}
                      </Link>
                    </Space>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Rate
                      value={
                        rates.find((x: { id: string }) => x.id == m.id)
                          ?.value || 0
                      }
                      style={{
                        fontSize: "0.8cqw",
                      }}
                      onChange={(value: number) => {
                        if (value != null) {
                          addRates({ id: m.id, value: value });
                        }
                      }}
                    ></Rate>
                  </Col>
                </Row>
              </div>
            </List.Item>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Favorites;
