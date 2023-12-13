import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { useMutation, useLazyQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import LOGIN from '../../apollo/auth';
import { GET_USER } from '../../apollo/user';
import { addJwtTokens, authSelector } from '../../redux/feature/authSlice';
import { userSelector, addUser } from '../../redux/feature/userSlice';
import { LoginFormData } from '../interfaces';
import LoginForm from './LoginForm';
import LoadingIndicator from '../LoadingIndicator';

/**
 * A component that renders a Login-Form and handles authentification.
 *
 */

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const tokens = useAppSelector(authSelector);
  const [formError, setFormError] = useState('');
  const [formState, setFormState] = useState<LoginFormData>({
    email: undefined,
    password: undefined,
  });
  interface LoginData {
    Auth: {
      loginJwt: {
        jwtTokens: {
          accessToken: string;
          refreshToken: string;
        };
      };
    };
  }
  interface LoginQueryVariables {
    loginJwtInput2: {
      email: string;
      password: string;
    };
  }
  const [getUser, { loading: userLoading, error: userError }] = useLazyQuery(
    GET_USER,
    {
      onCompleted: (userData) => {
        const currentUser = userData.Viewer.Auth.currentUser.user;
        dispatch(addUser(currentUser));
      },
    }
  );
  const [login, { loading: loginLoading }] = useMutation<
    LoginData,
    LoginQueryVariables
  >(LOGIN, {
    variables: {
      loginJwtInput2: {
        email: formState.email,
        password: formState.password,
      },
    },
    onError: (error) => {
      if (
        error.message.includes(
          'auth_login_with_email_and_password_unspecified_auth'
        )
      ) {
        setFormError('Error: Invalid credentials');
      } else {
        setFormError(`Error: ${error.message}`);
      }
    },
    onCompleted: (loginData) => {
      if (loginData) {
        Cookies.set(
          'refresh-token',
          loginData.Auth.loginJwt.jwtTokens.refreshToken || '',
          { /* httpOnly: true, */ secure: true }
        );
        dispatch(addJwtTokens(loginData.Auth.loginJwt.jwtTokens));
      }
    },
  });
  useEffect(() => {
    if (tokens.accessToken) getUser();
  }, [tokens, user, getUser, navigate]);

  useEffect(() => {
    if (user && user.name !== null) {
      navigate(`/dashboard/${user.name}`);
    }
  }, [user, navigate]);

  if (userLoading) return <LoadingIndicator />;
  if (userError)
    return (
      <Typography variant="h5" display="block" color="error.main" gutterBottom>
        Error Loading User
      </Typography>
    );
  return (
    <div>
      <Typography variant="h5" display="block" gutterBottom>
        Login
      </Typography>
      <LoginForm
        data={formState}
        setData={setFormState}
        setError={setFormError}
      />
      {formError && (
        <Typography
          variant="overline"
          display="block"
          color="error.main"
          gutterBottom
        >
          {formError}
        </Typography>
      )}
      <Button
        variant="outlined"
        onClick={() => login()}
        disabled={loginLoading}
      >
        Login
      </Button>
    </div>
  );
}

export default Login;
