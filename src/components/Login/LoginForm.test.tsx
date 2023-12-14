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
    const mockSetData = jest.fn();
    const mockSetError = jest.fn();

    render(
      <LoginForm
        data={mockData}
        setData={mockSetData}
        setError={mockSetError}
      />
    );

    // Проверяем, что компонент отрисован без ошибок
    expect(screen.getByLabelText(/Your E-Mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Password/i)).toBeInTheDocument();
  });

  test('validates email correctly', () => {
    const mockData = {
      email: '',
      password: '',
    };
    const mockSetData = jest.fn();
    const mockSetError = jest.fn();

    render(
      <LoginForm
        data={mockData}
        setData={mockSetData}
        setError={mockSetError}
      />
    );

    // Вводим некорректный email
    fireEvent.change(screen.getByLabelText(/Your E-Mail/i), {
      target: { value: 'invalidEmail' },
    });

    // Проверяем, что setError был вызван с соответствующим сообщением
    expect(mockSetError).toHaveBeenCalledWith(
      'Your E-Mail Format is incorrect'
    );

    // Вводим корректный email
    fireEvent.change(screen.getByLabelText(/Your E-Mail/i), {
      target: { value: 'valid@email.com' },
    });

    // Проверяем, что setError был вызван с пустым сообщением
    expect(mockSetError).toHaveBeenCalledWith('');

    // Проверяем, что setData был вызван с корректным значением email
    expect(mockSetData).toHaveBeenCalledWith({
      ...mockData,
      email: 'valid@email.com',
    });
  });

  // Тесты для других вариантов использования можно добавить по необходимости
});
