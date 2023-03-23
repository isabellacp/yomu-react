import { Layout, Input, theme, Card } from 'antd';
import React from 'react';
import Upcoming from '@/components/Upcoming';
import FavoriteMangas from '@/components/Favorites';
import BasicLayout from './layout';
import useFavorites from '@/hooks/useFavorites';
import useLogEntries from '@/hooks/useLogEntries';

const { Content } = Layout;

const App: React.FC = () => {
  const [favorites, addFavorite, removeFavorite] = useFavorites("bookmarks");
  const [logEntries, addLogEntry, removeLogEntry] = useLogEntries('logEntries');


  return (
    <BasicLayout favorites={favorites} addFavorites={addFavorite} removeFavorites={removeFavorite} logEntries={logEntries} addLogEntry={addLogEntry} removeLogEntry={removeLogEntry}>

      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        <FavoriteMangas favorites={favorites} removeFavorites={removeFavorite}></FavoriteMangas>
        <Upcoming></Upcoming>
      </Content>
    </BasicLayout>
  );
};

export default App;