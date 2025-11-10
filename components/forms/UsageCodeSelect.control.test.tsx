import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import UsageCodeSelect from './UsageCodeSelect';

function Wrapper() {
  const { control } = useForm({ defaultValues: { usageCode: '' } });

  return (
    <div>
      {/* Intentionally pass control directly to UsageCodeSelect (component should handle Controller internally) */}
      {/* @ts-expect-error testing runtime prop */}
      <UsageCodeSelect control={control} name="usageCode" />
    </div>
  );
}

describe('UsageCodeSelect control prop integration', () => {
  it('should render when passed control prop (component handles Controller internally)', () => {
    render(<Wrapper />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });
});
