import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title', () => {
  render(<App />);
  const heading = screen.getByText(/Tic Tac Toe/i);
  expect(heading).toBeInTheDocument();
});

test('shows current player initially', () => {
  render(<App />);
  const status = screen.getByText(/Current player: X/i);
  expect(status).toBeInTheDocument();
});
