import { render, screen } from '@testing-library/react';
import WeatherFetcher from './WeatherFetcher';

test('renders weather fetcher input', () => {
  render(<WeatherFetcher />);
  const input = screen.getByPlaceholderText(/enter city/i);
  expect(input).toBeInTheDocument();
});
