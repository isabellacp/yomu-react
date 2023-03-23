
import { Divider, Rate, Descriptions, Layout } from 'antd';
import BasicLayout from './layout';
import { useRouter } from 'next/router';
import useFavorites from '@/hooks/useFavorites';
import useLogEntries from '@/hooks/useLogEntries';
import FavoriteMangas from '@/components/Favorites';

const User: React.FC = () => {
    const [favorites, addFavorite, removeFavorite] = useFavorites("bookmarks");

    const router = useRouter();

    const [logEntries, addLogEntry, removeLogEntry] = useLogEntries('logEntries');

    return (
        <BasicLayout favorites={favorites} addFavorites={addFavorite} removeFavorites={removeFavorite} logEntries={logEntries} addLogEntry={addLogEntry} removeLogEntry={removeLogEntry}>
            <Layout style={{ padding: '0 24px', background: "white", minHeight: 280 }}>
                <FavoriteMangas favorites={favorites} removeFavorites={removeFavorite}></FavoriteMangas>
                <Divider orientation="left" style={{ marginTop: 0 }}>My Reviews</Divider>
                {logEntries.length > 0 ? logEntries.map((entry: any, index: any) => (

                    <Descriptions bordered style={{ marginBottom: 30 }}>
                        <Descriptions.Item label="Name">{entry.name}</Descriptions.Item>
                        <Descriptions.Item label="Chapter">{entry.chapter}</Descriptions.Item>
                        <Descriptions.Item label="Rating"><Rate
                            style={{ marginLeft: "20px" }}
                            allowHalf
                            disabled
                            defaultValue={0}
                            value={entry.rating}

                        /></Descriptions.Item>
                        <Descriptions.Item label="Comment" span={2}>{entry.comment}</Descriptions.Item>

                    </Descriptions>

                )
                ) : (
                    <p>No log entries yet.</p>
                )}

            </Layout>
        </BasicLayout>
    );
};

export default User;