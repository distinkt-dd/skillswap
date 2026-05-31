import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconUI } from './icon';

describe('IconUI', () => {
  it('отрисовывает svg с нужным размером и классом', () => {
    const { container } = render(<IconUI name="calendar" size={32} className="custom-icon" />);

    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
    expect(svg).toHaveClass('custom-icon');
  });
});
