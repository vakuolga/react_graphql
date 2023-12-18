import {
  Observable,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
} from '@apollo/client';
import ErrorLink from './client/links/errorLink';
import AuthLink from './client/links/authLink';
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
  link: from([ErrorLink, AuthLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;
