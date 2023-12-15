import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { useAppSelector } from '../../redux/hooks';
import { LoginFormData } from '../interfaces';
import LoginForm from './LoginForm';
import LoadingIndicator from '../LoadingIndicator';
import useAuthService from '../../hooks/useAuthService';
import { authSelector } from '../../redux/feature/authSlice';
import { userSelector } from '../../redux/feature/userSlice';

function Login() {
  const navigate = useNavigate();
  const { userLoading, userError, login, getUser } = useAuthService();
  const [formError, setFormError] = useState('');
  const [formState, setFormState] = useState<LoginFormData>({
    email: undefined,
    password: undefined,
  });

  const user = useAppSelector(userSelector);
  const authTokens = useAppSelector(authSelector);

  useEffect(() => {
    if (authTokens.accessToken) getUser();
  }, [authTokens, user, getUser, navigate]);

  useEffect(() => {
    if (user && user.name !== null) {
      navigate(`/dashboard/${user.name}`);
    }
  }, [user, navigate]);

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
      {userLoading && <LoadingIndicator />}
      {userError && (
        <Typography
          variant="h5"
          display="block"
          color="error.main"
          gutterBottom
        >
          Error Loading User
        </Typography>
      )}
      <Button
        variant="outlined"
        onClick={() => login(formState)}
        disabled={userLoading}
        data-testid="login-button"
      >
        Login
      </Button>
    </div>
  );
}

export default Login;
