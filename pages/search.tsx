import { useEffect, useState } from 'react';
import { StarFilled } from '@ant-design/icons';
import { StarOutlined } from '@ant-design/icons';

import { List, Layout, Card, Button, message } from 'antd';
import Manga from '@/types/Manga';
import BasicLayout from './layout';
import { useRouter } from 'next/router';
import useFavorites from '@/hooks/useFavorites';
import useLogEntries from '@/hooks/useLogEntries';

const SearchResults: React.FC = () => {
    const [favorites, addFavorite, removeFavorite] = useFavorites("bookmarks");
    const [logEntries, addLogEntry, removeLogEntry] = useLogEntries('logEntries');

    const [results, setResults] = useState<Manga[]>([]);
    const router = useRouter();

    const { query } = router.query;

    useEffect(() => {
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
        if (favorites.includes(id)) {
            removeFavorite(id)
            message.success("Bookmark removed successfully!");
        } else {
            addFavorite(id)
            message.success("Bookmark added successfully!");
        }
    };

    return (
        <BasicLayout favorites={favorites} addFavorites={addFavorite} removeFavorites={removeFavorite} logEntries={logEntries} addLogEntry={addLogEntry} removeLogEntry={removeLogEntry}>
            <Layout style={{ padding: '0 24px', minHeight: 280, background: "white" }}>
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={results}
                    renderItem={(item: Manga) => (
                        <List.Item>
                            <Card
                                cover={
                                    <img
                                        alt={item.attributes.canonicalTitle}
                                        src={item.attributes.posterImage ? item.attributes.posterImage.small : "/default-image.png"}
                                        style={{ objectFit: 'cover', height: 300 }}
                                    />
                                }
                                actions={[
                                    <Button
                                        type="text"

                                        icon={favorites.includes(item.id) ? <StarFilled /> : <StarOutlined />}
                                        onClick={() => handleBookmark(item.id)}
                                    >{favorites.includes(item.id) ? "Bookmarked" : "Bookmark"}</Button>
                                ]}
                            >
                                <Card.Meta
                                    title={<a href={item.attributes.canonicalTitle}>{item.attributes.canonicalTitle}</a>}
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