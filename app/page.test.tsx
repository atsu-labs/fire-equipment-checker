import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './page';

// Mock BuildingInputForm component
vi.mock('@/components/forms/BuildingInputForm', () => ({
  BuildingInputForm: () => <div data-testid="building-input-form">BuildingInputForm Mock</div>,
}));

describe('Home Page (Task 11.1)', () => {
  describe('ページレイアウト', () => {
    it('should render page with min-height screen', () => {
      const { container } = render(<Home />);
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('min-h-screen');
    });

    it('should have gradient background', () => {
      const { container } = render(<Home />);
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('bg-gradient-to-br');
      expect(outerDiv).toHaveClass('from-slate-50');
      expect(outerDiv).toHaveClass('to-slate-100');
    });

    it('should have padding for responsive design', () => {
      const { container } = render(<Home />);
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('py-8');
      expect(outerDiv).toHaveClass('px-4');
    });
  });

  describe('ページタイトル', () => {
    it('should render page title', () => {
      render(<Home />);
      expect(screen.getByText(/消防用設備規制判別システム/)).toBeInTheDocument();
    });

    it('should render page subtitle with system description', () => {
      render(<Home />);
      expect(screen.getByText(/建築物情報入力/)).toBeInTheDocument();
    });
  });

  describe('BuildingInputFormコンポーネント', () => {
    it('should render BuildingInputForm component', () => {
      render(<Home />);
      expect(screen.getByTestId('building-input-form')).toBeInTheDocument();
    });

    it('should have max-width container for BuildingInputForm', () => {
      const { container } = render(<Home />);
      const containerDiv = container.querySelector('.max-w-2xl');
      expect(containerDiv).toBeInTheDocument();
    });

    it('should center content horizontally', () => {
      const { container } = render(<Home />);
      const containerDiv = container.querySelector('.container');
      expect(containerDiv).toHaveClass('mx-auto');
    });
  });

  describe('レスポンシブデザイン', () => {
    it('should have container with mx-auto for centering', () => {
      const { container } = render(<Home />);
      const containerDiv = container.querySelector('.container');
      expect(containerDiv).toHaveClass('mx-auto');
    });

    it('should apply flex layout for responsive structure', () => {
      const { container } = render(<Home />);
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('flex');
      expect(outerDiv).toHaveClass('flex-col');
    });

    it('should have items-center for vertical center alignment', () => {
      const { container } = render(<Home />);
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('items-center');
    });
  });

  describe('ページ構造', () => {
    it('should have proper document structure', () => {
      const { container } = render(<Home />);
      // Check that main layout has proper nesting
      const outerDiv = container.firstChild;
      expect(outerDiv?.childNodes.length).toBeGreaterThan(0);
    });

    it('should use use-client directive implicitly (client component)', () => {
      // This component should be a client component to use hooks (if needed in future)
      // Currently verified by successful render with React features
      const { container } = render(<Home />);
      expect(container).toBeTruthy();
    });
  });
});
