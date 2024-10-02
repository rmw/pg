import React from 'react';
import { render } from '@testing-library/react';
import DateForWeeks from '../@lekoarts/gatsby-theme-cara/components/date-for-weeks';

test('renders DateForWeeks component with default weeks', () => {
  const { getByText } = render(<DateForWeeks />);
  const linkElement = getByText(/04\/18\/2023/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders DateForWeeks component with specific weeks', () => {
  const { getByText } = render(<DateForWeeks weeks={14} />);
  const linkElement = getByText(/07\/25\/2023/i);
  expect(linkElement).toBeInTheDocument();
});
