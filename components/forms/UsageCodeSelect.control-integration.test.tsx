import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import UsageCodeSelect from './UsageCodeSelect';

function Wrapper() {
  const { control, handleSubmit } = useForm({ defaultValues: { usageCode: '' } });
  const onSubmit = (data: any) => {
    const el = document.getElementById('submitted');
    if (el) el.textContent = data.usageCode;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* @ts-expect-error runtime prop */}
      <UsageCodeSelect control={control} name="usageCode" />
      <button type="submit">submit</button>
      <div id="submitted" />
    </form>
  );
}

describe('UsageCodeSelect control prop end-to-end integration', () => {
  it('submits selected value when used with control prop (should fail before implementation)', async () => {
    render(<Wrapper />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: '1-i' } });

    const btn = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(btn);

    const submitted = await screen.findByText('1-i');
    expect(submitted).toBeInTheDocument();
  });
});
