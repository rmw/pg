import React from 'react';
import { render } from '@testing-library/react';
import WeeksAlong from '../@lekoarts/gatsby-theme-cara/components/weeks-along';

test('renders WeeksAlong component with default date', () => {
  const { getByText } = render(<WeeksAlong />);
  const linkElement = getByText(/weeks and/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders WeeksAlong component with specific date', () => {
  const { getByText } = render(<WeeksAlong dateString="04/25/2023" />);
  const linkElement = getByText(/weeks and/i);
  expect(linkElement).toBeInTheDocument();
});
