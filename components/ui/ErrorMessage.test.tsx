import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('エラーメッセージを表示する', () => {
    render(<ErrorMessage message="必須項目です" />);
    
    expect(screen.getByText('必須項目です')).toBeInTheDocument();
  });

  it('赤文字で表示される', () => {
    render(<ErrorMessage message="エラー" />);
    
    const message = screen.getByText('エラー');
    expect(message).toHaveClass('text-red-600');
  });

  it('icon=trueでAlertCircleアイコンが表示される', () => {
    render(<ErrorMessage message="エラー" icon />);
    
    // lucide-reactのAlertCircleはsvgとしてレンダリングされる
    const container = screen.getByText('エラー').parentElement;
    expect(container?.querySelector('svg')).toBeInTheDocument();
  });

  it('icon=falseでアイコンが表示されない', () => {
    render(<ErrorMessage message="エラー" icon={false} />);
    
    const container = screen.getByText('エラー').parentElement;
    expect(container?.querySelector('svg')).not.toBeInTheDocument();
  });

  it('iconプロパティ省略時はアイコンが表示されない', () => {
    render(<ErrorMessage message="エラー" />);
    
    const container = screen.getByText('エラー').parentElement;
    expect(container?.querySelector('svg')).not.toBeInTheDocument();
  });
});
