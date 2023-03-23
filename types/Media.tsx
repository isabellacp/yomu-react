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
export default Media;