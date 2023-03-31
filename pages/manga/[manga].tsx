import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Layout,
  message,
  Descriptions,
  List,
  Button,
  Rate,
  Divider,
  Space,
} from "antd";
import { default as MangaType } from "@/types/Manga";
import { useRouter } from "next/router";
import BasicLayout from "../layout";
import useBookmarks from "@/hooks/useBookmarks";
import useLogEntries from "@/hooks/useLogEntries";
import { ShareAltOutlined } from "@ant-design/icons";
import useRatings from "@/hooks/useRatings";
import {
  HeartFilled,
  HeartOutlined,
  MessageFilled,
  TwitterCircleFilled,
} from "@ant-design/icons";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { EmailShareButton } from "react-share";
import TwitterShareButton from "react-share/lib/TwitterShareButton";
import TumblrShareButton from "react-share/lib/TumblrShareButton";
const { Title, Text } = Typography;

const Manga = () => {
  const [rates, addRates] = useRatings("rates");
  const [bookmarks, addBookmark, removeBookmark] = useBookmarks("bookmarks");
  const [logEntries, addLogEntry, removeLogEntry] = useLogEntries("logEntries");
  const [favorites, addFavorite, removeFavorite] = useBookmarks("favorites");

  const [manga, setManga] = useState<MangaType>();
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const router = useRouter();
  const mangaId = router.query.manga;

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

  useEffect(() => {
    if (mangaId == undefined) {
      return;
    }

    fetch(`https://kitsu.io/api/edge/manga/${mangaId}`)
      .then((res) => res.json())
      .then((data: { data: MangaType }) => {
        setManga(data.data);
        setLoading(false);
        console.log("=>>>", data);

        if (data && data.data && data.data.relationships.genres) {
          fetch(data.data.relationships.genres.links.related)
            .then((res) => res.json())
            .then((data) => {
              setGenres(data.data);
              console.log(data.data);
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  }, [mangaId]);

  return (
    <BasicLayout
      sidebar={false}
      bookmarks={bookmarks}
      addBookmarks={addBookmark}
      removeBookmarks={removeBookmark}
      logEntries={logEntries}
      addLogEntry={addLogEntry}
      removeLogEntry={removeLogEntry}
    >
      <Layout style={{ minHeight: 280, background: "white" }}>
        {loading || manga == undefined ? (
          <p>Loading...</p>
        ) : (
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} lg={{ span: 6 }}>
              <Row justify="center">
                <Space direction="vertical">
                  <div>
                    <img
                      style={{
                        objectFit: "cover",
                        borderRadius: 10,
                        width: "100%",
                        maxHeight: "50vh",
                        height: "100%",
                      }}
                      src={
                        manga && manga.attributes.posterImage
                          ? manga.attributes.posterImage.original
                          : "/default-card-image.jpg"
                      }
                      alt={manga.attributes.canonicalTitle}
                    />
                  </div>
                  <Space size={"large"} direction="vertical">
                    <Typography.Title level={2} style={{ marginBottom: 0 }}>
                      {manga.attributes.canonicalTitle}
                    </Typography.Title>
                    <Text>{manga.attributes.description}</Text>
                    <Descriptions column={1} bordered>
                      <Descriptions.Item label="Release date">
                        {manga.attributes.startDate}
                      </Descriptions.Item>
                      <Descriptions.Item label="Status">
                        {manga.attributes.status === "ongoing"
                          ? "Ongoing"
                          : "Finished"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Genre">
                        {genres
                          .map((genre) => genre["attributes"]["name"])
                          .join(", ")}
                      </Descriptions.Item>
                      <Descriptions.Item label="Chapters">
                        {manga.attributes.chapterCount}
                      </Descriptions.Item>
                      <Descriptions.Item label="Volumes">
                        {manga.attributes.volumeCount}
                      </Descriptions.Item>
                    </Descriptions>
                  </Space>
                </Space>
              </Row>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 14 }}>
              <Typography.Title level={3}>Chapters</Typography.Title>
              <Divider
                orientation="left"
                style={{
                  marginTop: 0,
                  height: "10px",
                  borderColor: "#75d0c0",
                  borderTopWidth: "6px",
                }}
              ></Divider>
              <List
                grid={{
                  gutter: 16,
                  xs: 4,
                  sm: 4,
                  md: 4,
                  lg: 8,
                  xl: 10,
                  xxl: 12,
                }}
                size="small"
                dataSource={Array.from(
                  {
                    length: manga.attributes.chapterCount
                      ? manga.attributes.chapterCount
                      : 1,
                  },
                  (_, i) => i + 1
                )}
                renderItem={(item) => (
                  <List.Item>
                    <Button
                      disabled={
                        logEntries.find(
                          (x) => x.chapter == item && x.id == manga.id
                        ) != undefined
                      }
                    >
                      {item}
                    </Button>
                  </List.Item>
                )}
              />
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 4 }}>
              <Typography.Title level={3}>Rate this series</Typography.Title>
              <Divider
                orientation="left"
                style={{
                  marginTop: 0,
                  marginBottom: "12px",
                  height: "10px",
                  borderColor: "#75d0c0",
                  borderTopWidth: "6px",
                }}
              ></Divider>
              <div style={{ textAlign: "center" }}>
                <Rate
                  value={rates.find((x) => x.id == manga.id)?.value || 0}
                  onChange={(value: number) => {
                    if (value != null) {
                      addRates({ id: manga.id, value: value });
                    }
                  }}
                  style={{
                    fontSize: "calc(4cqh - 5px)",
                    textAlign: "center",
                  }}
                ></Rate>
              </div>
              <Divider style={{ marginTop: 40 }} orientation="center">
                Other options
              </Divider>
              <Button
                style={{ marginTop: 20, width: "100%" }}
                type="primary"
                shape="round"
                size={"large"}
                icon={
                  bookmarks.includes(manga.id) ? (
                    <DeleteOutlined />
                  ) : (
                    <PlusCircleOutlined />
                  )
                }
                onClick={() => handleBookmark(manga.id)}
              >
                {bookmarks.includes(manga.id)
                  ? "Remove from shelf"
                  : "Add to shelf"}
              </Button>
              <Button
                style={{ marginTop: 20, width: "100%" }}
                type="primary"
                shape="round"
                size={"large"}
                icon={
                  favorites.includes(manga.id) ? (
                    <HeartFilled />
                  ) : (
                    <HeartOutlined />
                  )
                }
                onClick={() => handleFavorite(manga.id)}
              >
                {favorites.includes(manga.id)
                  ? "Remove from favorites"
                  : "Add to favorites"}
              </Button>
              <Row gutter={[8, 16]} style={{ marginTop: 20 }}>
                <Col xxl={8} xl={24} lg={24} md={24} sm={24} xs={24}>
                  <EmailShareButton
                    style={{ width: "100%" }}
                    subject={manga.attributes.canonicalTitle}
                    body={
                      "Checkout this manga:" + manga.attributes.canonicalTitle
                    }
                    url={""}
                  >
                    <Button
                      style={{ width: "100%" }}
                      type="default"
                      shape="round"
                      icon={<MessageFilled />}
                    >
                      Email
                    </Button>
                  </EmailShareButton>
                </Col>
                <Col xxl={8} xl={24} lg={24} md={24} sm={24} xs={24}>
                  <TwitterShareButton
                    style={{ width: "100%" }}
                    title={manga.attributes.canonicalTitle}
                    via={
                      "Checkout this manga:" + manga.attributes.canonicalTitle
                    }
                    url={"localhost:3000"}
                  >
                    <Button
                      style={{ width: "100%" }}
                      type="default"
                      shape="round"
                      icon={<TwitterCircleFilled />}
                    >
                      Twitter
                    </Button>
                  </TwitterShareButton>
                </Col>
                <Col xxl={8} xl={24} lg={24} md={24} sm={24} xs={24}>
                  <TumblrShareButton
                    style={{ width: "100%" }}
                    title={manga.attributes.canonicalTitle}
                    caption={
                      "Checkout this manga:" + manga.attributes.canonicalTitle
                    }
                    url={"localhost:3000"}
                  >
                    <Button
                      style={{ width: "100%" }}
                      type="default"
                      shape="round"
                      icon={<ShareAltOutlined />}
                    >
                      Tumblr
                    </Button>
                  </TumblrShareButton>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Layout>
    </BasicLayout>
  );
};

export default Manga;
