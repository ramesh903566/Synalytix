import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from '../../components/dashboard/stat-card';
import { TrendingUp, TrendingDown } from 'lucide-react';

describe('StatCard', () => {
  it('renders correctly with given props', () => {
    render(
      <StatCard
        label="Total Views"
        value="1.2M"
        trend={{ value: 12, direction: 'up' }}
        icon={TrendingUp}
      />
    );
    
    expect(screen.getByText('Total Views')).toBeInTheDocument();
    expect(screen.getByText('1.2M')).toBeInTheDocument();
    expect(screen.getByText('12%')).toBeInTheDocument();
    // The icon is rendered but we can just check if svg exists
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders negative trend correctly', () => {
    render(
      <StatCard
        label="Bounce Rate"
        value="45%"
        trend={{ value: 5, direction: 'down' }}
        icon={TrendingDown}
      />
    );
    
    expect(screen.getByText('5%')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <StatCard
        label="Total Views"
        value="1.2M"
        trend={{ value: 12, direction: 'up' }}
        icon={TrendingUp}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
