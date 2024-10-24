import { render, screen } from '@testing-library/react';
import Page from '../app/page';

test('should render home page correctly', () => {
  render(<Page />);

  const main = screen.getByText('Hello World');

  expect(main).toBeInTheDocument();
});
