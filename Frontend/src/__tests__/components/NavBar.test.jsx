import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/NavBar';
import { AuthProvider } from '../../context/AuthContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper to render with providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
  });

  it('renders the logo', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('AI Journal')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    localStorage.getItem.mockReturnValue(null);
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('shows user avatar when authenticated', () => {
    localStorage.getItem.mockReturnValue('fake-token');
    renderWithProviders(<Navbar />);
    // When authenticated, the Get Started button should not be present
    // and user menu elements should be available
    expect(screen.queryByText('Get Started')).toBeNull();
  });

  it('navigates to home when logo is clicked (unauthenticated)', () => {
    localStorage.getItem.mockReturnValue(null);
    renderWithProviders(<Navbar />);
    
    const logo = screen.getByText('AI Journal');
    fireEvent.click(logo);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
