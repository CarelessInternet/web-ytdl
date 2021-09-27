import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import server from '../server/index';
import App from './App';

afterAll(() => {
  server.close();
});

test('have download button', () => {
  render(<App />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

test('have input field with rickroll link', () => {
  render(<App />);
  expect(screen.getByPlaceholderText('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBeInTheDocument();
});

test('download button disables after click', () => {
  render(<App />);

  const button = screen.getByRole('button');
  button.click();

  expect(button).toBeDisabled();
});

test('get invalid youtube video url error', async () => {
  render(<App />);

  const input = screen.getByPlaceholderText('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  userEvent.type(input, 'sample text');
  
  const button = screen.getByRole('button');
  button.click();

  await waitFor(() => {
    expect(screen.getByText('An invalid Youtube video URL was provided')).toBeInTheDocument();
  });
});

test('download me at the zoo youtube video (0:18 long)', async () => {
  render(<App />);

  const input = screen.getByPlaceholderText('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  userEvent.type(input, 'https://www.youtube.com/watch?v=jNQXAC9IVRw');
  
  const button = screen.getByRole('button');
  button.click();

  await waitFor(() => {
    expect(screen.getByTestId('source')).toBeInTheDocument();
  }, {
    timeout: 20 * 1000
  });
});

test('download ksi & lil wayne - lose youtube video (3:33 long) and 10 min countdown (10:16 long)', async () => {
  render(<App />);

  const input = screen.getByPlaceholderText('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  userEvent.type(input, 'https://www.youtube.com/watch?v=r5inVONkOKQ');
  
  const button = screen.getByRole('button');
  button.click();

  await waitFor(() => {
    expect(screen.getByTestId('source')).toBeInTheDocument();
  }, {
    timeout: 30 * 1000
  });

  userEvent.type(input, 'https://www.youtube.com/watch?v=4ASKMcdCc3g');
  button.click();

  await waitFor(() => {
    expect(screen.getByTestId('source')).toBeInTheDocument();
  }, {
    timeout: 30 * 1000
  });
});