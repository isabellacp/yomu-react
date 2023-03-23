import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Divider, Tag, Empty, Space } from 'antd';
import Manga from '@/types/Manga';


const { Meta } = Card;


const FavoriteMangas: React.FC<{ favorites: string[], removeFavorites: any }> = ({ favorites, removeFavorites }) => {
    const [favoriteMangas, setFavoriteMangas] = useState<Manga[]>([]);



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
        <div style={{ marginBottom: "40px" }}>
            <Divider orientation="left" style={{ marginTop: 0 }}>My Favorite Mangas</Divider>
            <Row gutter={[16, 16]}>
                {favoriteMangas.length !== 0 ? favoriteMangas.map((manga) => (
                    <Col span={6} key={manga.id}>
                        <Card
                            actions={[<span onClick={() => removeFavorites(manga.id)}>Remove favorite</span>]}
                        >
                            <Meta title={`${manga.attributes.canonicalTitle}`} description={<Tag>{manga.attributes.mangaType.toLocaleUpperCase()}</Tag>} />
                        </Card>
                    </Col>
                )) : <Col span={24}><Empty /></Col>}
            </Row>
        </div>
    );
};

export default FavoriteMangas;