import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { userSelector } from '../../redux/feature/userSlice';
import { GET_USER_NODES } from '../../apollo/user';
import { useAppSelector } from '../../redux/hooks';
import client from '../../apollo/client';
import { UserData, Edge } from '../../apollo/interfaces';
import EdgesListMemo from './ScrollableList/List';
import useSortableList from '../../hooks/useSortableList';
import LoadingIndicator from '../LoadingIndicator';
import useAuthService from '../../hooks/useAuthService';

function Dashboard() {
  const navigate = useNavigate();
  const user = useAppSelector(userSelector);
  const bottom = useRef(null);
  const STORAGE_KEY = 'sortableList';
  const FIRST = 5;

  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const { logout } = useAuthService();
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
    logout();
    setIsLoggedOut(true);
    navigate('/login');
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
