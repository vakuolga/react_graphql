import React from 'react';
import { TextField, Box } from '@mui/material';
import { LoginFormProps } from '../interfaces';

/**
 * A component that renders a Login-Form and handles authentification.
 *
 * @param data email and password provided
 * @param setData data SetStateAction provided by parent
 * @param setError an error SetStateAction provided by parent
 */

function LoginForm(props: LoginFormProps) {
  const { data, setData, setError } = props;
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const handleChangeEmail = (email: string) => {
    if (!validateEmail(email)) setError('Your E-Mail Format is incorrect');
    else setError('');
    setData({
      ...data,
      email,
    });
  };
  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        '& .MuiTextField-root': { m: 1, width: '50ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        required
        id="email-input"
        type="email"
        label="Your E-Mail"
        variant="outlined"
        autoComplete="email"
        data-testid="email-input"
        onChange={(event: React.ChangeEvent) => {
          handleChangeEmail((event.target as HTMLInputElement).value);
        }}
      />
      <TextField
        required
        id="password-input"
        type="password"
        label="Your Password"
        variant="outlined"
        autoComplete="current-password"
        data-testid="password-input"
        onChange={(event: React.ChangeEvent) =>
          setData({
            ...data,
            password: (event.target as HTMLInputElement).value,
          })
        }
      />
    </Box>
  );
}

export default LoginForm;
