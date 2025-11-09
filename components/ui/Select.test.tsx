import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select Component', () => {
  const simpleOptions = [
    { value: '1', label: 'オプション1' },
    { value: '2', label: 'オプション2' },
    { value: '3', label: 'オプション3' },
  ];

  const groupedOptions = [
    {
      label: '(一)項',
      options: [
        { value: '1-i', label: '劇場、映画館' },
        { value: '1-ro', label: '公会堂、集会場' },
      ],
    },
    {
      label: '(二)項',
      options: [
        { value: '2-i', label: 'キャバレー、ナイトクラブ' },
        { value: '2-ro', label: '遊技場' },
      ],
    },
  ];

  it('renders with label', () => {
    render(<Select label="用途コード" options={simpleOptions} />);
    expect(screen.getByLabelText('用途コード')).toBeInTheDocument();
  });

  it('displays simple options', () => {
    render(<Select label="用途コード" options={simpleOptions} />);
    const select = screen.getByLabelText('用途コード') as HTMLSelectElement;
    
    expect(select.options.length).toBe(4); // placeholder + 3 options
    expect(select.options[1].value).toBe('1');
    expect(select.options[1].text).toBe('オプション1');
  });

  it('displays grouped options with optgroup', () => {
    render(<Select label="用途コード" groups={groupedOptions} />);
    const select = screen.getByLabelText('用途コード') as HTMLSelectElement;
    
    // Check optgroups exist
    const optgroups = select.querySelectorAll('optgroup');
    expect(optgroups.length).toBe(2);
    expect(optgroups[0].label).toBe('(一)項');
    expect(optgroups[1].label).toBe('(二)項');
  });

  it('displays error message with red styling', () => {
    render(
      <Select
        label="用途コード"
        options={simpleOptions}
        error="用途コードを選択してください"
      />
    );
    const errorMessage = screen.getByText('用途コードを選択してください');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('applies red border when error exists', () => {
    render(
      <Select
        label="用途コード"
        options={simpleOptions}
        error="用途コードを選択してください"
      />
    );
    const select = screen.getByLabelText('用途コード');
    expect(select).toHaveClass('border-red-500');
  });

  it('accepts user selection', async () => {
    const user = userEvent.setup();
    render(<Select label="用途コード" options={simpleOptions} />);
    const select = screen.getByLabelText('用途コード') as HTMLSelectElement;
    
    await user.selectOptions(select, '2');
    expect(select.value).toBe('2');
  });

  it('has accessible placeholder option', () => {
    render(<Select label="用途コード" options={simpleOptions} placeholder="選択してください" />);
    const select = screen.getByLabelText('用途コード') as HTMLSelectElement;
    
    expect(select.options[0].value).toBe('');
    expect(select.options[0].text).toBe('選択してください');
    expect(select.options[0].disabled).toBe(true);
  });

  it('is responsive with Tailwind CSS', () => {
    render(<Select label="用途コード" options={simpleOptions} />);
    const select = screen.getByLabelText('用途コード');
    expect(select).toHaveClass('w-full');
  });

  it('supports disabled state', () => {
    render(<Select label="用途コード" options={simpleOptions} disabled />);
    const select = screen.getByLabelText('用途コード') as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });

  it('integrates with React Hook Form via forwardRef', () => {
    const ref = { current: null };
    render(<Select ref={ref} label="用途コード" options={simpleOptions} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
