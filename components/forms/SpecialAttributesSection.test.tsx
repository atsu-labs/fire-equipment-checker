import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SpecialAttributesSection from './SpecialAttributesSection';
import { buildingInfoFormSchemaExtended, type BuildingInfoFormExtendedInput } from '@/lib/regulations/utils/schemas';

// SpecialAttributesSectionをテストするためのラッパーコンポーネント
function TestWrapper() {
  const {
    control,
    formState: { errors },
  } = useForm<BuildingInfoFormExtendedInput>({
    resolver: zodResolver(buildingInfoFormSchemaExtended),
    mode: 'onBlur',
    defaultValues: {
      usageCode: '6-ro-1',
      totalArea: '1000',
      floors: '5',
      undergroundFloors: '0',
    },
  });

  return <SpecialAttributesSection control={control} errors={errors} floors={5} />;
}

describe('SpecialAttributesSection', () => {
  describe('レンダリング', () => {
    it('should render all checkboxes', () => {
      render(<TestWrapper />);

      expect(screen.getByLabelText(/無窓階/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/避難階/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/避難上有効な屋外階段/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/防火壁区画/i)).toBeInTheDocument();
    });

    it('should render directStairCount field when floors >= 3', () => {
      render(<TestWrapper />);

      expect(screen.getByLabelText(/直通階段数/i)).toBeInTheDocument();
    });

    it('should not render directStairCount field when floors < 3', () => {
      function TestWrapperLowFloors() {
        const {
          control,
          formState: { errors },
        } = useForm<BuildingInfoFormExtendedInput>({
          resolver: zodResolver(buildingInfoFormSchemaExtended),
          mode: 'onBlur',
          defaultValues: {
            usageCode: '6-ro-1',
            totalArea: '1000',
            floors: '2',
            undergroundFloors: '0',
          },
        });

        return <SpecialAttributesSection control={control} errors={errors} floors={2} />;
      }

      render(<TestWrapperLowFloors />);

      expect(screen.queryByLabelText(/直通階段数/i)).not.toBeInTheDocument();
    });
  });

  describe('ユーザー操作', () => {
    it('should toggle checkbox when clicked', async () => {
      render(<TestWrapper />);

      const checkbox = screen.getByLabelText(/無窓階/i) as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      await userEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);

      await userEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });

    it('should allow entering directStairCount value', async () => {
      render(<TestWrapper />);

      const input = screen.getByLabelText(/直通階段数/i) as HTMLInputElement;
      await userEvent.type(input, '2');

      expect(input.value).toBe('2');
    });
  });

  describe('ヘルプテキスト', () => {
    it('should display help text for checkboxes', () => {
      render(<TestWrapper />);

      expect(screen.getByText(/すべての出入口が屋内に面している階/i)).toBeInTheDocument();
      expect(screen.getByText(/直接地上へ通じる出口を有する階/i)).toBeInTheDocument();
    });

    it('should display help text for directStairCount', () => {
      render(<TestWrapper />);

      expect(screen.getByText(/避難階又は地上に直通する階段の数/i)).toBeInTheDocument();
    });
  });
});
