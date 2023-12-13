import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { userSelector } from '../../redux/feature/userSlice';
import { GET_USER_NODES } from '../../apollo/user';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import resetAll from '../../redux/feature/resetAllSlice';
import client from '../../apollo/client';
import { UserData, Edge } from '../../apollo/interfaces';
import EdgesListMemo from './ScrollableList/List';
import useSortableList from '../../hooks/useSortableList';
import LoadingIndicator from '../LoadingIndicator';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const bottom = useRef(null);
  const STORAGE_KEY = 'sortableList';
  const FIRST = 5;

  const [isLoggedOut, setIsLoggedOut] = useState(false);
  interface UserNodesQueryVariables {
    after: null | string;
    first: number;
  }
  const { data, loading, fetchMore } = useQuery<
    UserData,
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

  const updateList = useCallback(
    (newList: Edge[]) => {
      setList((prevList) => [...prevList, ...newList]);
    },
    [setList]
  );
  const getHasNextPage = useCallback(
    (data: UserData) =>
      data ? data.Admin.Tree.GetContentNodes.pageInfo.hasNextPage : true,
    []
  );

  const getAfter = useCallback(
    (data: UserData) =>
      data && data?.Admin.Tree.GetContentNodes.pageInfo
        ? data.Admin.Tree.GetContentNodes.pageInfo.endCursor
        : null,
    []
  );

  const loadMore = useCallback(async () => {
    if (isLoggedOut) return;
    const nextPage = getHasNextPage(data);
    const after = getAfter(data);

    if (nextPage && after !== null) {
      await fetchMore({
        variables: { after, first: FIRST },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;

          const newEdges = fetchMoreResult.Admin.Tree.GetContentNodes.edges;
          client.writeQuery({
            query: GET_USER_NODES,
            variables: { after, first: FIRST },
            data: {
              Admin: {
                ...fetchMoreResult.Admin,
                Tree: {
                  ...fetchMoreResult.Admin.Tree,
                  GetContentNodes: {
                    __typename: 'GetContentNodes',
                    edges: [
                      ...previousResult.Admin.Tree.GetContentNodes.edges,
                      ...newEdges,
                    ],
                    pageInfo:
                      fetchMoreResult.Admin.Tree.GetContentNodes.pageInfo,
                  },
                },
              },
            },
          });
          updateList(newEdges);
          return {
            Admin: {
              ...previousResult.Admin,
              Tree: {
                ...previousResult.Admin.Tree,
                GetContentNodes: {
                  __typename: 'GetContentNodes',
                  edges: [
                    ...previousResult.Admin.Tree.GetContentNodes.edges,
                    ...newEdges,
                  ],
                  pageInfo: fetchMoreResult.Admin.Tree.GetContentNodes.pageInfo,
                },
              },
            },
          };
        },
      });
    }
  }, [data, fetchMore, getHasNextPage, getAfter, isLoggedOut, updateList]);

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

  useEffect(() => {
    if (!user.name) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(resetAll());
    Cookies.remove('refresh-token');
    Cookies.remove('secret');
    client.resetStore();
    setIsLoggedOut(true);
    navigate('/login');
    localStorage.clear();
  };

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
