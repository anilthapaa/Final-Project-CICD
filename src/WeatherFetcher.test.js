import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeatherFetcher from './weather.js';

// Mock fetch for testing API call behavior
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders input and button', () => {
  render(<WeatherFetcher />);
  const input = screen.getByPlaceholderText(/enter city name/i);
  expect(input).toBeInTheDocument();

  const button = screen.getByRole('button', { name: /get weather/i });
  expect(button).toBeInTheDocument();
});

test('shows error message when clicking button with empty input', async () => {
  render(<WeatherFetcher />);
  const button = screen.getByRole('button', { name: /get weather/i });
  fireEvent.click(button);
  
  const errorMessage = await screen.findByText(/please enter a city name/i);
  expect(errorMessage).toBeInTheDocument();
});

test('fetches and displays weather data on valid city', async () => {
  const mockResponse = {
    main: { temp: 22.5 },
    name: 'Test City',
    weather: [{ description: 'clear sky', icon: '01d' }],
  };
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockResponse,
  });

  render(<WeatherFetcher />);
  const input = screen.getByPlaceholderText(/enter city name/i);
  const button = screen.getByRole('button', { name: /get weather/i });

  fireEvent.change(input, { target: { value: 'Test City' } });
  fireEvent.click(button);

  // Wait for the weather info to appear
  const cityName = await screen.findByText(/weather in/i);
  expect(cityName).toHaveTextContent('Weather in Test City');

  const temp = screen.getByText(/23°C/); // Rounded temperature
  expect(temp).toBeInTheDocument();

  const condition = screen.getByText(/clear sky/i);
  expect(condition).toBeInTheDocument();

  const img = screen.getByRole('img', { name: /clear sky/i });
  expect(img).toHaveAttribute('src', expect.stringContaining('01d'));
});

test('shows error message on fetch failure', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
  });

  render(<WeatherFetcher />);
  const input = screen.getByPlaceholderText(/enter city name/i);
  const button = screen.getByRole('button', { name: /get weather/i });

  fireEvent.change(input, { target: { value: 'Unknown City' } });
  fireEvent.click(button);

  const error = await screen.findByText(/city not found/i);
  expect(error).toBeInTheDocument();
});
