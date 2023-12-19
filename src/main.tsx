import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';
import { store } from './redux/store';
import App from './App';
import client from './apollo/client';
import getRefreshToken from './apollo/client/utils';

if (Cookies.get('refreshToken')) getRefreshToken();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
