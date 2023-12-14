import React, { useCallback } from 'react';
import { Edge, PageData } from '../apollo/interfaces';
import client from '../apollo/client';
import { GET_USER_NODES } from '../apollo/user';
import { UseInfiniteScrollProps } from './interfaces';

/**
 * Hook for handling requests triggered by infinite scroll.
 *
 * @param setList update sortable list
 * @param isLoggedOut
 * @param fetchMore ApolloClient function
 * @param FIRST const defined in Dashboard
 * @param data data obtained on request success
 */

const useInfiniteScroll = (props: UseInfiniteScrollProps) => {
  const { setList, isLoggedOut, fetchMore, FIRST, data } = props;
  const updateList = useCallback(
    (newList: Edge[]) => {
      setList((prevList) => [...prevList, ...newList]);
    },
    [setList]
  );
  const getHasNextPage = useCallback(
    (data: PageData | undefined) =>
      data ? data.Admin.Tree.GetContentNodes.pageInfo.hasNextPage : true,
    []
  );
  const getAfter = useCallback(
    (data: PageData | undefined) =>
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

  return { loadMore };
};

export default useInfiniteScroll;
