import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input label="延床面積" type="number" />);
    expect(screen.getByLabelText('延床面積')).toBeInTheDocument();
  });

  it('displays unit when provided', () => {
    render(<Input label="延床面積" type="number" unit="㎡" />);
    expect(screen.getByText('㎡')).toBeInTheDocument();
  });

  it('displays help text when provided', () => {
    render(
      <Input
        label="延床面積"
        type="number"
        helpText="建築物の延べ面積を入力してください"
      />
    );
    expect(screen.getByText('建築物の延べ面積を入力してください')).toBeInTheDocument();
  });

  it('displays error message with red styling', () => {
    render(
      <Input
        label="延床面積"
        type="number"
        error="正の数値を入力してください"
      />
    );
    const errorMessage = screen.getByText('正の数値を入力してください');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('applies red border when error exists', () => {
    render(
      <Input
        label="延床面積"
        type="number"
        error="正の数値を入力してください"
      />
    );
    const input = screen.getByLabelText('延床面積');
    expect(input).toHaveClass('border-red-500');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input label="延床面積" type="number" />);
    const input = screen.getByLabelText('延床面積') as HTMLInputElement;
    
    await user.type(input, '1000');
    expect(input.value).toBe('1000');
  });

  it('supports text input type', () => {
    render(<Input label="建物名" type="text" />);
    const input = screen.getByLabelText('建物名') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('supports number input type', () => {
    render(<Input label="階数" type="number" />);
    const input = screen.getByLabelText('階数') as HTMLInputElement;
    expect(input.type).toBe('number');
  });

  it('is responsive with Tailwind CSS', () => {
    render(<Input label="延床面積" type="number" />);
    const input = screen.getByLabelText('延床面積');
    expect(input).toHaveClass('w-full');
  });
});
