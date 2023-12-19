import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  test('renders without errors', () => {
    const mockData = {
      email: '',
      password: '',
    };
    const mockSetData = vi.fn();
    const mockSetError = vi.fn();

    render(
      <LoginForm
        data={mockData}
        setData={mockSetData}
        setError={mockSetError}
      />
    );

    // Check that the component is rendered without errors
    expect(screen.getByLabelText(/Your E-Mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Password/i)).toBeInTheDocument();
  });

  test('validates email correctly', () => {
    const mockData = {
      email: '',
      password: '',
    };
    const mockSetData = vi.fn();
    const mockSetError = vi.fn();

    render(
      <LoginForm
        data={mockData}
        setData={mockSetData}
        setError={mockSetError}
      />
    );

    // Enter an incorrect E-Mail
    fireEvent.change(screen.getByLabelText(/Your E-Mail/i), {
      target: { value: '@invalidEmail.com' },
    });

    // Check that setError was called with the appropriate message
    expect(mockSetError).toHaveBeenCalledWith(
      'Your E-Mail Format is incorrect'
    );

    // Enter a correct email
    fireEvent.change(screen.getByLabelText(/Your E-Mail/i), {
      target: { value: 'valid@email.com' },
    });

    // Check that setError was called with an empty message
    expect(mockSetError).toHaveBeenCalledWith('');

    // Check that setData was called with the correct email value
    expect(mockSetData).toHaveBeenCalledWith({
      ...mockData,
      email: 'valid@email.com',
    });
  });
});

// Clean up localStorage after the test
afterAll(() => {
  vi.restoreAllMocks();
});
