interface Manga {
    id: string;
    attributes: {
        canonicalTitle: string;
        volumeCount: number;
        chapterCount: number;
        nextRelease: string;
        posterImage: {
            small: string;
        };
        mangaType: string;
        synopsis: string;
    };
}
export default Manga;