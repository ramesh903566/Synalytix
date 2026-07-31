import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../../components/navigation/sidebar';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

// Mock context provider
const renderWithProviders = (ui: React.ReactElement, onToggle: () => void = vi.fn()) => {
  return render(
    <BrowserRouter>
      <AppContext.Provider value={{
        logout: vi.fn(),
        connectedApps: [],
        refreshConnections: vi.fn(),
        plannerTasks: [],
        addPlannerTask: vi.fn(),
        updatePlannerTask: vi.fn(),
        deletePlannerTask: vi.fn(),
      } as any}>
        {ui}
      </AppContext.Provider>
    </BrowserRouter>
  );
};

describe('Sidebar', () => {
  it('renders correctly when expanded', () => {
    renderWithProviders(<Sidebar collapsed={false} onToggle={() => {}} />);
    expect(screen.getByText('Synalytix')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders correctly when collapsed', () => {
    renderWithProviders(<Sidebar collapsed={true} onToggle={() => {}} />);
    // The brand name is hidden when collapsed
    expect(screen.queryByText('Synalytix')).not.toBeInTheDocument();
  });

  it('calls onToggle when collapse button is clicked', async () => {
    const onToggleMock = vi.fn();
    renderWithProviders(<Sidebar collapsed={false} onToggle={onToggleMock} />);
    
    const collapseBtn = screen.getByRole('button', { name: /collapse/i });
    await userEvent.click(collapseBtn);
    
    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });
});
