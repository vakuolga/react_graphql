import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import errorLink from './client/links/errorLink';
import authLink from './client/links/authLink';
import { BASE_URL } from './client/links/links';

/**
 * Client
 */

export const httpLink = new HttpLink({
  uri: `${BASE_URL}/api/graphql`,
  fetch,
  credentials: 'include',
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;
