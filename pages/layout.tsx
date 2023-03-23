import { Calendar, Layout, Input, theme, Row, Col, Space, Card, Avatar, Divider, Modal, Select, Rate, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Trending from '@/components/Trending';
import { useRouter } from 'next/router';
import Manga from '@/types/Manga';
import Link from 'next/link';
const { Header, Content, Footer, Sider } = Layout;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

export default function BasicLayout({
    favorites, addFavorites, removeFavorites,
    logEntries, addLogEntry, removeLogEntry,
    children, // will be a page or nested layout
}: {
    favorites: string[], addFavorites: any, removeFavorites: any,
    logEntries: any[], addLogEntry: any, removeLogEntry: any,
    children: React.ReactNode,
}) {
    const [searchValue, setSearchValue] = useState('');
    const router = useRouter();
    const [comment, setComment] = useState('');

    const [selectedManga, setSelectedManga] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [favoriteMangas, setFavoriteMangas] = useState<Manga[]>([]);
    const [rating, setRating] = useState<number>(0);

    useEffect(() => {
        if (favorites.length > 0) {
            const fetchManga = async () => {
                const idsString = favorites.join(',');
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
                setFavoriteMangas(mangas);
            };
            fetchManga();
        } else {
            setFavoriteMangas([]);
        }
    }, [favorites]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        router.push(`/search?query=${value}`);
    };

    const handleLog = () => {
        setModalVisible(true);
    };

    const handleOk = () => {
        const selectedMangaObj = favoriteMangas.find((manga) => manga.id === selectedManga);
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

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <Header>
                <Row justify="space-between" align="middle">

                    <Col style={{ color: "white" }}>
                        <Link href={"/"}>Yomu Journal</Link>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={4} xs={4}>
                        <Space.Compact style={{ width: "100%" }}>  <Search
                            placeholder="input search text"
                            onSearch={handleSearch}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ width: "100%" }}
                        /></Space.Compact>
                    </Col>
                    <Col style={{ color: "white" }}>

                        <Avatar shape="square" size="large" icon={<UserOutlined />} />
                        <Link href={"user"}>Chopper</Link>
                    </Col>

                </Row>

            </Header>
            <Content style={{ padding: '0 50px' }}>

                <Layout style={{ padding: '24px', background: colorBgContainer }}>
                    <Sider style={{ background: colorBgContainer }} width={300} >
                        <Card
                            style={{ width: 300 }}
                            cover={
                                <img
                                    alt="example"
                                    src="chopper.jpg"
                                />
                            }
                            actions={[
                                <a onClick={handleLog}>Log a new entry</a>,
                            ]}
                        >
                            <Meta
                                title="User Name"
                                description="Welcome back!"
                            />
                        </Card>
                        <Divider />
                        <Calendar fullscreen={false} />
                        <Divider />

                        <Trending></Trending>
                    </Sider>
                    {children}


                </Layout>
            </Content >
            <Footer style={{ textAlign: 'center' }}>Yomu</Footer>

            <Modal title="Log Entry" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Select
                    style={{ width: "100%", marginBottom: "20px" }}
                    placeholder="Select a manga"
                    value={selectedManga}
                    onChange={handleMangaSelect}
                >
                    {favoriteMangas.map((manga) => (
                        <Option key={manga.id} value={manga.id}>{manga.attributes.canonicalTitle}</Option>
                    ))}
                </Select>
                {selectedManga ? (
                    <Card
                        style={{ marginBottom: 16 }}
                        cover={<img style={{ maxHeight: 200, objectFit: "cover" }} alt={favoriteMangas.find((x) => x.id == selectedManga)?.attributes.canonicalTitle} src={favoriteMangas.find((x) => x.id == selectedManga)?.attributes.posterImage.small} />}
                    >
                        <Meta
                            title={favoriteMangas.find((x) => x.id == selectedManga)?.attributes.canonicalTitle}
                            description={<Tag>{favoriteMangas.find((x) => x.id == selectedManga)?.attributes.mangaType.toUpperCase()}</Tag>} style={{ paddingBottom: 20 }} />
                        <Row align={"middle"} justify="space-between">
                            <Col>
                                <span>Chapter</span>
                                <Select
                                    style={{ width: 100, marginTop: "10px", marginLeft: "20px" }}
                                    placeholder="Select a chapter"
                                    value={selectedChapter}
                                    onChange={handleChapterSelect}
                                >
                                    {[...Array(favoriteMangas.find((x) => x.id == selectedManga)?.attributes.chapterCount)].map((x, i) =>
                                        <Option key={i + 1} value={i + 1}>{i + 1}</Option>
                                    )}
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
                        <Input.TextArea style={{ marginTop: 20 }} placeholder="Comments" onChange={(e) => setComment(e.target.value)} value={comment} />

                    </Card>
                ) : (
                    <div>
                        Please select a manga first.
                    </div>
                )}
            </Modal>
        </Layout >
    );
};