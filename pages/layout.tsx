import {
  Calendar,
  Layout,
  Input,
  theme,
  Row,
  Col,
  Space,
  Card,
  Avatar,
  Divider,
  Modal,
  Select,
  Rate,
  Tag,
  Button,
} from "antd";
import {
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Trending from "@/components/Trending";
import { useRouter } from "next/router";
import Manga from "@/types/Manga";
import Link from "next/link";
const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

export default function BasicLayout({
  bookmarks,
  addBookmarks,
  removeBookmarks,
  logEntries,
  addLogEntry,
  removeLogEntry,
  sidebar,
  children, // will be a page or nested layout
}: {
  bookmarks: string[];
  addBookmarks: any;
  removeBookmarks: any;
  logEntries: any[];
  addLogEntry: any;
  removeLogEntry: any;
  sidebar: boolean;
  children: React.ReactNode;
}) {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const [comment, setComment] = useState("");

  const [selectedManga, setSelectedManga] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [reachedBreakpoint, setReachedBreakpoint] = useState(false);

  const [bookmarkMangas, setBookmarkMangas] = useState<Manga[]>([]);
  const [rating, setRating] = useState<number>(0);

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
            chapterCount: manga.attributes.chapterCount,
          },
        }));
        setBookmarkMangas(mangas);
      };
      fetchManga();
    } else {
      setBookmarkMangas([]);
    }
  }, [bookmarks]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    router.push(`/search?query=${value}`);
  };

  const handleLog = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    const selectedMangaObj = bookmarkMangas.find(
      (manga) => manga.id === selectedManga
    );
    if (selectedMangaObj && selectedChapter && rating) {
      const logEntry = {
        name: selectedMangaObj.attributes.canonicalTitle,
        id: selectedManga,
        chapter: selectedChapter,
        rating: rating,
        comment: comment,
      };
      addLogEntry(logEntry);
    }
    setModalVisible(false);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleMangaSelect = (value: string) => {
    setSelectedManga(value);
  };

  const handleChapterSelect = (value: string) => {
    setSelectedChapter(value);
  };
  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  const handleSideBarCollapsed = () => {
    setSideBarCollapsed(!sideBarCollapsed);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          position: sideBarCollapsed ? "fixed" : "inherit",
          top: 0,
          zIndex: 1,
          width: "100%",
          height: "64px",
          backgroundColor: "#24243F",
        }}
      >
        <Row justify="space-between" align="middle">
          {reachedBreakpoint && (
            <Button
              type="primary"
              shape="circle"
              icon={sideBarCollapsed ? <MenuOutlined /> : <CloseOutlined />}
              onClick={() => {
                handleSideBarCollapsed();
              }}
            ></Button>
          )}
          <Col
            style={{
              color: "white",
            }}
          >
            <Link
              style={{
                fontFamily: "Delicious Handrawn",
                fontSize: "2rem",
                lineHeight: "30px",
              }}
              href={"/"}
            >
              yomu
            </Link>
          </Col>
          <Col xl={8} lg={8} md={8} sm={8} xs={8}>
            <Space.Compact style={{ width: "100%" }}>
              <Search
                placeholder="Search Mangas"
                onSearch={handleSearch}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              />
            </Space.Compact>
          </Col>
          <Col style={{ color: "white" }}>
            <Link href={"/user"}>
              <Avatar shape="square" size="large" icon={<UserOutlined />} />
              {!reachedBreakpoint && "Chopper"}
            </Link>
          </Col>
        </Row>
      </Header>
      <Content style={{ paddingTop: sideBarCollapsed ? "64px" : "0" }}>
        <Layout style={{ padding: "24px", background: colorBgContainer }}>
          {sidebar && (
            <Sider
              trigger={null}
              collapsed={sideBarCollapsed}
              style={{
                background: sideBarCollapsed ? "transparent" : "white",
                left: "0",
                padding: reachedBreakpoint ? "24px" : "0",
                position: reachedBreakpoint ? "absolute" : "inherit",
                zIndex: 100,
              }}
              width={reachedBreakpoint ? "100%" : 300}
              breakpoint="lg"
              collapsedWidth="0"
              onBreakpoint={(broken) => {
                setReachedBreakpoint(broken);
                setSideBarCollapsed(broken);
              }}
            >
              <Card
                cover={<img alt="example" src="chopper.jpg" />}
                actions={[
                  <a
                    style={{
                      fontWeight: "bold",
                      wordSpacing: "5px",
                    }}
                    onClick={handleLog}
                  >
                    LOG <PlusCircleFilled />
                  </a>,
                ]}
              >
                <Meta title="Chopper" description="Welcome back!" />
              </Card>
              <Divider />
              <Calendar fullscreen={false} />
              <Divider />

              <Trending></Trending>
            </Sider>
          )}
          {children}
        </Layout>
      </Content>
      <Footer style={{ textAlign: "center" }}>Yomu</Footer>

      <Modal
        title="Log Entry"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select
          style={{ width: "100%", marginBottom: "20px" }}
          placeholder="Select a manga"
          value={selectedManga}
          onChange={handleMangaSelect}
        >
          {bookmarkMangas.map((manga) => (
            <Option key={manga.id} value={manga.id}>
              {manga.attributes.canonicalTitle}
            </Option>
          ))}
        </Select>
        {selectedManga ? (
          <Card
            style={{ marginBottom: 16 }}
            cover={
              <img
                style={{ maxHeight: 200, objectFit: "cover" }}
                alt={
                  bookmarkMangas.find((x) => x.id == selectedManga)?.attributes
                    .canonicalTitle
                }
                src={
                  bookmarkMangas.find((x) => x.id == selectedManga)?.attributes
                    .posterImage.original
                }
              />
            }
          >
            <Meta
              title={
                bookmarkMangas.find((x) => x.id == selectedManga)?.attributes
                  .canonicalTitle
              }
              description={
                <Tag>
                  {bookmarkMangas
                    .find((x) => x.id == selectedManga)
                    ?.attributes.mangaType.toUpperCase()}
                </Tag>
              }
              style={{ paddingBottom: 20 }}
            />
            <Row align={"middle"} justify="space-between">
              <Col>
                <span>Chapter</span>
                <Select
                  style={{ width: 100, marginTop: "10px", marginLeft: "20px" }}
                  placeholder="Select a chapter"
                  value={selectedChapter}
                  onChange={handleChapterSelect}
                >
                  {[
                    ...Array(
                      bookmarkMangas.find((x) => x.id == selectedManga)
                        ?.attributes.chapterCount
                    ),
                  ].map((x, i) => (
                    <Option key={i + 1} value={i + 1}>
                      {i + 1}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <Rate
                  style={{ marginLeft: "20px" }}
                  allowHalf
                  defaultValue={0}
                  value={rating}
                  onChange={handleRatingChange}
                />
              </Col>
            </Row>
            <Input.TextArea
              style={{ marginTop: 20 }}
              placeholder="Comments"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
          </Card>
        ) : (
          <div>Please select a manga first.</div>
        )}
      </Modal>
    </Layout>
  );
}
