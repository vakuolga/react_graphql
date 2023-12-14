import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

import Login from './Login';
import { LOGIN } from '../../apollo/auth';

const mocks = [
  {
    request: {
      query: LOGIN,
      variables: {
        loginJwtInput2: {
          email: 'test@example.com',
          password: 'password123',
        },
      },
    },
    result: {
      data: {
        Auth: {
          loginJwt: {
            jwtTokens: {
              accessToken: 'mockAccessToken',
              refreshToken: 'mockRefreshToken',
            },
          },
        },
      },
    },
  },
];

describe('Login Component', () => {
  it('calls login function on button click', async () => {
    const httpLink = new HttpLink({
      uri: '/api/graphql',
      credentials: 'include',
    });

    const client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    });

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Login />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      // Добавьте здесь проверки, которые вы ожидаете после успешного выполнения запроса
      // Например, проверка изменения состояния компонента или появления определенного элемента
    });
  });
});
