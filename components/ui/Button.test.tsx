import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with children text', () => {
    render(<Button variant="primary" size="md">クリック</Button>);
    expect(screen.getByRole('button', { name: 'クリック' })).toBeInTheDocument();
  });

  it('applies primary variant styles', () => {
    render(<Button variant="primary" size="md">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
  });

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary" size="md">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-900');
  });

  it('applies danger variant styles', () => {
    render(<Button variant="danger" size="md">Danger</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('text-white');
  });

  it('applies small size styles', () => {
    render(<Button variant="primary" size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-xs');
    expect(button).toHaveClass('px-2');
    expect(button).toHaveClass('py-1');
  });

  it('applies medium size styles', () => {
    render(<Button variant="primary" size="md">Medium</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-sm');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
  });

  it('applies large size styles', () => {
    render(<Button variant="primary" size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-base');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
  });

  it('renders with lucide-react icon', () => {
    render(
      <Button variant="primary" size="md" icon={Plus}>
        追加
      </Button>
    );
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('displays loading state with spinner', () => {
    render(
      <Button variant="primary" size="md" isLoading>
        送信中
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <Button variant="primary" size="md" disabled>
        無効
      </Button>
    );
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('applies disabled styles', () => {
    render(
      <Button variant="primary" size="md" disabled>
        無効
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Button variant="primary" size="md" onClick={handleClick}>
        クリック
      </Button>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Button variant="primary" size="md" disabled onClick={handleClick}>
        無効
      </Button>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('supports submit type', () => {
    render(
      <Button variant="primary" size="md" type="submit">
        送信
      </Button>
    );
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });

  it('defaults to button type', () => {
    render(<Button variant="primary" size="md">ボタン</Button>);
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
  });
});
