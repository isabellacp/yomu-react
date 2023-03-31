import {
  Divider,
  Rate,
  Descriptions,
  Layout,
  Typography,
  Row,
  Col,
  Avatar,
  Card,
  Statistic,
} from "antd";
import BasicLayout from "./layout";
import { useRouter } from "next/router";
import { UserOutlined } from "@ant-design/icons";
import useRatings from "@/hooks/useRatings";

import useBookmarks from "@/hooks/useBookmarks";
import useLogEntries from "@/hooks/useLogEntries";
import BookmarkMangas from "@/components/Bookmarks";
import Favorites from "@/components/Favorites";
import useFavorites from "@/hooks/useFavorites";

const User: React.FC = () => {
  const [bookmarks, addBookmark, removeBookmark] = useBookmarks("bookmarks");
  const [favorites, addFavorite] = useFavorites("favorites");
  const [rates, addRates] = useRatings("rates");

  const router = useRouter();

  const [logEntries, addLogEntry, removeLogEntry] = useLogEntries("logEntries");

  return (
    <BasicLayout
      sidebar={false}
      bookmarks={bookmarks}
      addBookmarks={addBookmark}
      removeBookmarks={removeBookmark}
      logEntries={logEntries}
      addLogEntry={addLogEntry}
      removeLogEntry={removeLogEntry}
    >
      <Layout
        style={{ padding: "0 24px", background: "white", minHeight: 280 }}
      >
        <Row gutter={[32, 32]}>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 8 }}
            xl={{ span: 6 }}
            xxl={{ span: 4 }}
          >
            <div style={{ textAlign: "center" }}>
              <Avatar size={128} src="chopper.jpg" />
            </div>
            <Typography.Title level={3} style={{ textAlign: "center" }}>
              Chopper
            </Typography.Title>
            <span>Doctor for the Strawhats Crew and cotton candy Lover.</span>
            <Card style={{ margin: "30px 0px" }}>
              <Typography.Title level={4}>My Stats</Typography.Title>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="Log entries" value={logEntries.length} />
                </Col>
                <Col span={8}>
                  <Statistic title="Favorites" value={favorites.length} />
                </Col>
                <Col span={8}>
                  <Statistic title="Reviews" value={rates.length} />
                </Col>
              </Row>
            </Card>
            <Favorites
              favorites={favorites}
              addFavorite={addFavorite}
              rates={rates}
              addRates={addRates}
            ></Favorites>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 16 }}
            xl={{ span: 18 }}
            xxl={{ span: 20 }}
          >
            <BookmarkMangas
              bookmarks={bookmarks}
              removeBookmarks={removeBookmark}
            ></BookmarkMangas>
            <Typography.Title level={3}>My Reviews</Typography.Title>
            <Divider
              orientation="left"
              style={{
                marginTop: 0,
                height: "10px",
                borderColor: "#75d0c0",
                borderTopWidth: "6px",
              }}
            ></Divider>{" "}
            {logEntries.length > 0 ? (
              logEntries.map((entry: any, index: any) => (
                <Descriptions bordered style={{ marginBottom: 30 }}>
                  <Descriptions.Item label="Name">
                    {entry.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Chapter">
                    {entry.chapter}
                  </Descriptions.Item>
                  <Descriptions.Item label="Rating">
                    <Rate
                      style={{ marginLeft: "20px" }}
                      allowHalf
                      disabled
                      defaultValue={0}
                      value={entry.rating}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Comment" span={4}>
                    {entry.comment}
                  </Descriptions.Item>
                </Descriptions>
              ))
            ) : (
              <p>No log entries yet.</p>
            )}
          </Col>
        </Row>
      </Layout>
    </BasicLayout>
  );
};

export default User;
