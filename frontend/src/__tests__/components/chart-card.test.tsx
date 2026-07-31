import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChartCard } from '../../components/dashboard/chart-card';

// Mock Recharts to avoid actual rendering in jsdom
vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

describe('ChartCard', () => {
  it('renders title, action and children', () => {
    render(
      <ChartCard title="Audience Growth" action={<button>Filter</button>}>
        <div data-testid="chart-content">Chart goes here</div>
      </ChartCard>
    );
    
    expect(screen.getByText('Audience Growth')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByTestId('chart-content')).toBeInTheDocument();
  });
  
  it('matches snapshot', () => {
    const { container } = render(
      <ChartCard title="Audience Growth">
        <div>Chart goes here</div>
      </ChartCard>
    );
    expect(container).toMatchSnapshot();
  });
});
