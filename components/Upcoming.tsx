import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Divider, Tag } from 'antd';


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
            const response = await fetch(
                'https://kitsu.io/api/edge/manga?filter[status]=upcoming,unreleased&sort=-userCount&page[limit]=12'
            );
            const data = await response.json();
            setMangaList(
                data.data.map((manga: any) => ({
                    id: manga.id,
                    attributes: {
                        canonicalTitle: manga.attributes.canonicalTitle,
                        episodeCount: manga.attributes.episodeCount,
                        nextRelease: manga.attributes.nextRelease,
                        posterImage: manga.attributes.posterImage,
                        ageRating: manga.attributes.ageRating,
                        mangaType: manga.attributes.mangaType,
                    },
                })).filter((manga: any) => manga.attributes.ageRating != "R")
            );
        };

        fetchManga();
    }, []);

    return (
        <div>
            <Divider orientation="left" style={{ marginTop: 0 }}>Discover</Divider>
            <Row gutter={[16, 16]}>
                {mangaList.map((manga) => (
                    <Col span={6} key={manga.id}>
                        <Card
                            cover={<img alt={manga.attributes.canonicalTitle} src={manga.attributes.posterImage.small} />}
                        >
                            <Meta title={`${manga.attributes.canonicalTitle}`} description={<Tag>{manga.attributes.mangaType.toLocaleUpperCase()}</Tag>} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Upcoming;