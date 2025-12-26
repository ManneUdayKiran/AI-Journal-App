import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Test component to access auth context
function TestComponent() {
  const { token, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="token">{token || 'no-token'}</span>
      <span data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</span>
      <button onClick={() => login('test-token')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
  });

  it('provides initial unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('no');
    expect(screen.getByTestId('token').textContent).toBe('no-token');
  });

  it('login sets token and updates authenticated state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      loginButton.click();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    expect(screen.getByTestId('authenticated').textContent).toBe('yes');
    expect(screen.getByTestId('token').textContent).toBe('test-token');
  });

  it('logout removes token and updates authenticated state', async () => {
    localStorage.getItem.mockReturnValue('existing-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText('Logout');
    
    await act(async () => {
      logoutButton.click();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(screen.getByTestId('authenticated').textContent).toBe('no');
  });

  it('loads token from localStorage on mount', () => {
    localStorage.getItem.mockReturnValue('stored-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('yes');
    expect(screen.getByTestId('token').textContent).toBe('stored-token');
  });
});
