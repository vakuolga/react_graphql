import { useEffect, useRef } from 'react';
import { Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Typography from '@mui/material/Typography';
import { userSelector } from '../../redux/feature/userSlice';
import { GET_USER_NODES } from '../../apollo/user';
import { useAppSelector } from '../../redux/hooks';
import {
  PageData,
  Edge,
  UserNodesQueryVariables,
} from '../../apollo/interfaces';
import EdgesListMemo from './ScrollableList/List';
import useSortableList from '../../hooks/useSortableList';
import LoadingIndicator from '../LoadingIndicator';
import useAuthService from '../../hooks/useAuthService';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

function Dashboard() {
  const navigate = useNavigate();
  const user = useAppSelector(userSelector);
  const bottom = useRef(null);
  const STORAGE_KEY = 'sortableList';
  const FIRST = 5;
  const { logout, isLoggedOut, setIsLoggedOut } = useAuthService();

  useEffect(() => {
    if (!user.name) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    setIsLoggedOut(true);
    navigate('/login');
  };

  const { data, loading, fetchMore } = useQuery<
    PageData,
    UserNodesQueryVariables
  >(GET_USER_NODES, {
    variables: {
      after: null,
      first: FIRST,
    },
  });
  const localStorageData = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || '[]'
  ) as Edge[];
  const { list, moveItem, setList } = useSortableList<Edge>(
    localStorageData || []
  );
  const { loadMore } = useInfiniteScroll({
    setList,
    isLoggedOut,
    fetchMore,
    FIRST,
    data,
  });
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!isLoggedOut) loadMore();
      }
    });
    if (bottom?.current) observer.observe(bottom.current);
    return () => {
      observer.disconnect();
    };
  }, [data, fetchMore, loadMore, isLoggedOut]);

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => handleLogout()}>
          Logout
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        {user?.name ? `Dahboard of ${user?.name}` : `No username`}
      </Typography>
      <EdgesListMemo edges={list && list} moveItem={moveItem} />
      {loading && <LoadingIndicator />}
      <div ref={bottom} data-testid="bottom" />
    </Container>
  );
}

export default Dashboard;
