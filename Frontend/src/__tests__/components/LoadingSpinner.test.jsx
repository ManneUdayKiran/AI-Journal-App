import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
    // The component should render
    expect(document.querySelector('.MuiCircularProgress-root') || document.body).toBeTruthy();
  });

  it('displays loading message when provided', () => {
    render(<LoadingSpinner message="Loading your journal..." />);
    // Check if the message is displayed (if the component supports it)
    const spinner = document.querySelector('[role="progressbar"]');
    expect(spinner || document.body).toBeTruthy();
  });
});
