// authService.ts
import Cookies from 'js-cookie';
import { useLazyQuery } from '@apollo/client';
import { useAppDispatch } from '../redux/hooks';
import resetAll from '../redux/feature/resetAllSlice';
import client from '../apollo/client';
import { addJwtTokens } from '../redux/feature/authSlice';
import { GET_USER } from '../apollo/user';
import LOGIN from '../apollo/auth';
import { addUser } from '../redux/feature/userSlice';
import { LoginFormData } from '../components/interfaces';

const useAuthService = () => {
  const dispatch = useAppDispatch();

  const [getUser, { loading: userLoading, error: userError }] = useLazyQuery(
    GET_USER,
    {
      onCompleted: (PageData) => {
        const currentUser = PageData.Viewer.Auth.currentUser.user;
        dispatch(addUser(currentUser));
      },
    }
  );

  const login = async (formState: LoginFormData) => {
    try {
      const { data } = await client.mutate({
        mutation: LOGIN,
        variables: {
          loginJwtInput2: {
            email: formState.email,
            password: formState.password,
          },
        },
      });

      if (data) {
        Cookies.set(
          'refresh-token',
          data.Auth.loginJwt.jwtTokens.refreshToken || '',
          { secure: true }
        );
        dispatch(addJwtTokens(data.Auth.loginJwt.jwtTokens));
        getUser();
      }
    } catch (error) {
      if (
        error.message.includes(
          'auth_login_with_email_and_password_unspecified_auth'
        )
      ) {
        throw new Error('Error: Invalid credentials');
      } else {
        throw new Error(`Error: ${error.message}`);
      }
    }
  };

  const logout = () => {
    dispatch(resetAll());
    Cookies.remove('refresh-token');
    Cookies.remove('secret');
    client.resetStore();
    localStorage.clear();
  };

  return { userLoading, userError, login, logout, getUser };
};

export default useAuthService;
