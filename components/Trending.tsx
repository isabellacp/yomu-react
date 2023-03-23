import React, { useState, useEffect } from "react";
import { Layout, Tabs, List, Avatar } from "antd";
import { BookOutlined, VideoCameraOutlined } from "@ant-design/icons";

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

const Trending: React.FC = () => {
    const [media, setMedia] = useState<Media[]>([]);
    const [selectedTab, setSelectedTab] = useState("manga");

    useEffect(() => {
        const fetchMedia = async () => {
            const response = await fetch(
                `https://kitsu.io/api/edge/${selectedTab}?sort=popularityRank&limit=5`
            );
            const data = await response.json();
            // get the first 5
            setMedia(data.data.slice(0, 5));
        };

        fetchMedia();
    }, [selectedTab]);

    const handleTabClick = (key: string) => {
        setSelectedTab(key);
    };

    return (
        <div>
            <Tabs
                defaultActiveKey="manga"
                activeKey={selectedTab}
                tabPosition="top"
                tabBarExtraContent={{ left: <span style={{ paddingRight: "30px" }}>Popular now</span> }}
                style={{ height: "100vh" }}
                onTabClick={handleTabClick}
            >
                <Tabs.TabPane tab={<span><BookOutlined /> Manga</span>} key="manga">
                    <List
                        itemLayout="horizontal"
                        dataSource={media}
                        renderItem={(m) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={m.attributes.posterImage.small} />}
                                    title={m.attributes.canonicalTitle}
                                />
                            </List.Item>
                        )}
                    />
                </Tabs.TabPane >
                <Tabs.TabPane tab={<span><VideoCameraOutlined /> Anime</span>} key="anime">
                    <List
                        itemLayout="horizontal"
                        dataSource={media}
                        renderItem={(m) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={m.attributes.posterImage.small} />}
                                    title={m.attributes.canonicalTitle}
                                />
                            </List.Item>
                        )}
                    />
                </Tabs.TabPane >
            </Tabs>
        </div>
    );
};

export default Trending;