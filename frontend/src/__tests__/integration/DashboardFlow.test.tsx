import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import { AppContext } from '../../context/AppContext';
import Dashboard from '../../pages/Dashboard';

vi.mock('../../hooks/useMediaQuery', () => ({
  useIsDesktop: () => true,
}));

const mockContextValue = {
  logout: vi.fn(),
  connectedApps: ['github', 'x'],
  refreshConnections: vi.fn(),
  scheduledPosts: [],
  savedDrafts: [],
  plannerTasks: [],
  addPlannerTask: vi.fn(),
  updatePlannerTask: vi.fn(),
  deletePlannerTask: vi.fn(),
};

describe('Dashboard Integration Flow', () => {
  it('renders AppLayout and Dashboard without crashing', () => {
    // Basic smoke test for the layout and main dashboard page
    render(
      <MemoryRouter initialEntries={['/app']}>
        <AppContext.Provider value={mockContextValue as any}>
          <AppLayout />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // Verify layout renders Sidebar elements
    expect(screen.getByText('Synalytix')).toBeInTheDocument();
    
    // The Dashboard component should render top-level headings or elements if it was included in routing
    // Since AppLayout uses <Outlet />, we can just render the Dashboard directly to test its internals
    render(
      <MemoryRouter initialEntries={['/app']}>
        <AppContext.Provider value={mockContextValue as any}>
          <Dashboard />
        </AppContext.Provider>
      </MemoryRouter>
    );
    
    // Check for some known content in Dashboard
    expect(screen.getByText(/Total Followers/i)).toBeInTheDocument();
  });
});
