import { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { userSelector } from '../../redux/feature/userSlice';
import { GET_USER_NODES } from '../../apollo/user';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { PageData, Edge } from '../../apollo/interfaces';
import EdgesListMemo from './ScrollableList/List';
import useSortableList from '../../hooks/useSortableList';
import LoadingIndicator from '../LoadingIndicator';
import useAuthService from '../../hooks/useAuthService';
import { UserNodesQueryVariables } from '../../apollo/interfaces';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

function Dashboard() {
  const navigate = useNavigate();
  const user = useAppSelector(userSelector);
  const bottom = useRef(null);
  const STORAGE_KEY = 'sortableList';
  const FIRST = 5;
  const {logout} = useAuthService();

  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    if (!user.name) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    setIsLoggedOut(true);
    logout();
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
  const {loadMore} = useInfiniteScroll({
    setList, isLoggedOut, fetchMore, FIRST, data
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
    <>
      <Button variant="outlined" onClick={() => handleLogout()}>
        Logout
      </Button>
      <h2>{user?.name || 'No username'}</h2>
      <EdgesListMemo edges={list && list} moveItem={moveItem} />
      {loading && <LoadingIndicator />}
      <div ref={bottom} />
    </>
  );
}

export default Dashboard;
