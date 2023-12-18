import Cookies from 'js-cookie';
import { addJwtTokens } from '../../redux/feature/authSlice';
import { store } from '../../redux/store';
import { BASE_URL } from './links/links';

export const getRefreshToken = async () => {
  const refreshToken = Cookies.get('refresh-token');
  const accountId = Cookies.get('secret');
  if (!refreshToken || !accountId) return undefined;

  try {
    const response = await fetch(`${BASE_URL}/api/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken, accountId }),
    });

    if (!response.ok) {
      throw new Error(`Error refreshing token: ${response.status}`);
    }

    const data = await response.json();
    store.dispatch(addJwtTokens(data));
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};
