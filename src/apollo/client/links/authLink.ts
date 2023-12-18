import { setContext } from '@apollo/client/link/context';
import { store } from '../../../redux/store';
import { getRefreshToken } from '../utils';

const AuthLink = setContext(async (_, { headers }) => {
  const token = store.getState().auth.accessToken || (await getRefreshToken());
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

export default AuthLink;
