import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('ラベルとチェックボックスを表示する', () => {
    render(<Checkbox label="無窓階" />);
    
    expect(screen.getByLabelText('無窓階')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('チェックボックスをクリックして選択できる', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="避難階" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('エラーメッセージが表示される', () => {
    render(<Checkbox label="防火壁区画" error="この項目は必須です" />);
    
    expect(screen.getByText('この項目は必須です')).toBeInTheDocument();
  });

  it('エラー時にチェックボックスに赤枠が表示される', () => {
    render(<Checkbox label="有効な屋外階段" error="エラー" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('border-red-500');
  });

  it('ヘルプテキストが表示される', () => {
    render(<Checkbox label="無窓階" helpText="令第8条に該当する階" />);
    
    expect(screen.getByText('令第8条に該当する階')).toBeInTheDocument();
  });

  it('disabled属性が機能する', () => {
    render(<Checkbox label="避難階" disabled />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('forwardRefでref転送ができる', () => {
    let ref: HTMLInputElement | null = null;
    render(<Checkbox label="テスト" ref={(el) => { ref = el; }} />);
    
    expect(ref).toBeInstanceOf(HTMLInputElement);
    expect(ref?.type).toBe('checkbox');
  });
});
