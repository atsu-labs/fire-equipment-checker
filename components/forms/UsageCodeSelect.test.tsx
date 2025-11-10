import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import UsageCodeSelect from './UsageCodeSelect';

describe('UsageCodeSelect component', () => {
  it('renders grouped options and calls onChange when selecting an option', () => {
    const handleChange = vi.fn();

    render(<UsageCodeSelect name="usageCode" onChange={handleChange} />);

  // optgroup labels should be present as optgroup[label]
  const select = screen.getByRole('combobox') as HTMLSelectElement;
  const optgroupIchi = select.querySelector('optgroup[label="(一)項"]');
  const optgroupJuroku = select.querySelector('optgroup[label="(十六)項"]');
  expect(optgroupIchi).toBeTruthy();
  expect(optgroupJuroku).toBeTruthy();
    // select an option
    fireEvent.change(select, { target: { value: '1-i' } });

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls[0][0]).toBe('1-i');
  });
});
