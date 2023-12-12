import React from 'react';

export interface LoginFormData {
  email: undefined | string;
  password: undefined | string;
}

export interface LoginFormProps {
  data: LoginFormData;
  setData: React.Dispatch<React.SetStateAction<LoginFormData>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}
