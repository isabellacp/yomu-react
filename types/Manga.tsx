interface Manga {
    id: string;
    attributes: {
        canonicalTitle: string;
        volumeCount: number;
        chapterCount: number;
        description: string;
        nextRelease: string;
        startDate: string;
        status: 'ongoing' | 'finished';
        genres: { attributes: { name: string } }[];

        posterImage: {
            original: string;
            small: string;
        };

        mangaType: string;
        synopsis: string;
    }
    relationships: {
        genres: {
            links: {
                self: string
                related: string
            }
        }
        categories: {
            links: {
                self: string
                related: string
            }
        }
        castings: {
            links: {
                self: string
                related: string
            }
        }
        installments: {
            links: {
                self: string
                related: string
            }
        }
        mappings: {
            links: {
                self: string
                related: string
            }
        }
        reviews: {
            links: {
                self: string
                related: string
            }
        }
        mediaRelationships: {
            links: {
                self: string
                related: string
            }
        }
        characters: {
            links: {
                self: string
                related: string
            }
        }
        staff: {
            links: {
                self: string
                related: string
            }
        }
        productions: {
            links: {
                self: string
                related: string
            }
        }
        quotes: {
            links: {
                self: string
                related: string
            }
        }
        chapters: {
            links: {
                self: string
                related: string
            }
        }
        mangaCharacters: {
            links: {
                self: string
                related: string
            }
        }
        mangaStaff: {
            links: {
                self: string
                related: string
            }
        }
    }
}


export default Manga;
