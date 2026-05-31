import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Subcategory } from './Subcategory';
import styles from './Subcategory.module.css';

describe('Subcategory', () => {
  it('отрисовывает title без иконки', () => {
    const { container } = render(<Subcategory type="business" title="Маркетинг" />);

    expect(screen.getByText('Маркетинг')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(styles.subcategory, styles.tagBusiness);
  });

  it('отрисовывает иконку вместо текста', () => {
    const { container } = render(
      <Subcategory type="home" title="Дом" icon={<span data-testid="subcategory-icon">H</span>} />
    );

    expect(screen.getByTestId('subcategory-icon')).toBeInTheDocument();
    expect(screen.queryByText('Дом')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass(styles.subcategoryIcon, styles.tagHome);
  });

  it('использует класс tagOther для типа other', () => {
    const { container } = render(<Subcategory type="other" title="Другое" />);

    expect(container.firstChild).toHaveClass(styles.tagOther);
  });

  it('использует корректные классы для остальных типов', () => {
    const cases = [
      { type: 'creative', title: 'Творчество', className: styles.tagCreative },
      { type: 'languages', title: 'Языки', className: styles.tagLanguages },
      { type: 'education', title: 'Образование', className: styles.tagEducation },
      { type: 'health', title: 'Здоровье', className: styles.tagHealth },
    ] as const;

    for (const testCase of cases) {
      const { container, unmount } = render(
        <Subcategory type={testCase.type} title={testCase.title} />
      );

      expect(screen.getByText(testCase.title)).toBeInTheDocument();
      expect(container.firstChild).toHaveClass(styles.subcategory, testCase.className);

      unmount();
    }
  });
});
