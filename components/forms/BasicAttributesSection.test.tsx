import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BasicAttributesSection from './BasicAttributesSection';

describe('BasicAttributesSection', () => {
  it('renders three numeric inputs with units and help texts', () => {
    render(<BasicAttributesSection />);

    expect(screen.getByLabelText('延床面積')).toBeInTheDocument();
    expect(screen.getByLabelText('階数')).toBeInTheDocument();
    expect(screen.getByLabelText('地階数')).toBeInTheDocument();

    // units
    expect(screen.getAllByText('㎡').length).toBeGreaterThan(0);
    expect(screen.getAllByText('階').length).toBeGreaterThan(0);
  });

  it('displays error message when errors prop is provided', () => {
    const errors: any = { totalArea: { message: '必須項目です' } };
    render(<BasicAttributesSection errors={errors} />);

    expect(screen.getByText('必須項目です')).toBeInTheDocument();
  });
});
