import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('isOpen=falseの時は表示されない', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmDialog
        isOpen={false}
        title="確認"
        message="削除しますか?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    
    expect(screen.queryByText('確認')).not.toBeInTheDocument();
  });

  it('isOpen=trueの時にタイトルとメッセージが表示される', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmDialog
        isOpen={true}
        title="入力内容の削除"
        message="入力内容を削除しますか?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    
    expect(screen.getByText('入力内容の削除')).toBeInTheDocument();
    expect(screen.getByText('入力内容を削除しますか?')).toBeInTheDocument();
  });

  it('確認ボタンをクリックするとonConfirmが呼ばれる', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmDialog
        isOpen={true}
        title="確認"
        message="実行しますか?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    
    const confirmButton = screen.getByText('はい');
    await user.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('キャンセルボタンをクリックするとonCancelが呼ばれる', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmDialog
        isOpen={true}
        title="確認"
        message="実行しますか?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    
    const cancelButton = screen.getByText('いいえ');
    await user.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('confirmLabelとcancelLabelをカスタマイズできる', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmDialog
        isOpen={true}
        title="確認"
        message="実行しますか?"
        confirmLabel="実行"
        cancelLabel="中止"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    
    expect(screen.getByText('実行')).toBeInTheDocument();
    expect(screen.getByText('中止')).toBeInTheDocument();
  });

  it('Escapeキーを押すとonCancelが呼ばれる', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmDialog
        isOpen={true}
        title="確認"
        message="実行しますか?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    
    await user.keyboard('{Escape}');
    
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('モーダルオーバーレイが表示される', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        title="確認"
        message="実行しますか?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    
    // 背景オーバーレイの存在確認
    const overlay = container.querySelector('[role="dialog"]');
    expect(overlay).toBeInTheDocument();
  });
});
