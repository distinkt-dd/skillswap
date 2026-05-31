import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from './Dropdown';

const options = [
  { id: '1', name: 'Москва' },
  { id: '2', name: 'Казань' },
  { id: '3', name: 'Сочи' },
];

describe('Dropdown', () => {
  it('открывает и показывает опции в режиме одиночного выбора', async () => {
    const user = userEvent.setup();

    render(<Dropdown options={options} placeholder="Выберите город" />);

    await user.click(screen.getByRole('button', { name: 'Выберите город' }));

    expect(screen.getByText('Москва')).toBeInTheDocument();
    expect(screen.getByText('Казань')).toBeInTheDocument();
    expect(screen.getByText('Сочи')).toBeInTheDocument();
  });

  it('вызывает onChange и закрывается после выбора опции в режиме одиночного выбора', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Dropdown options={options} placeholder="Выберите город" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Выберите город' }));
    await user.click(screen.getByText('Казань'));

    expect(onChange).toHaveBeenCalledWith(options[1]);
    expect(screen.queryByText('Москва')).not.toBeInTheDocument();
  });

  it('фильтрует опции в режиме поиска', async () => {
    const user = userEvent.setup();

    render(<Dropdown options={options} searchable placeholder="Найти город" />);

    const input = screen.getByPlaceholderText('Найти город');

    await user.click(input);
    await user.type(input, 'каз');

    expect(screen.getByText('Казань')).toBeInTheDocument();
    expect(screen.queryByText('Москва')).not.toBeInTheDocument();
    expect(screen.queryByText('Сочи')).not.toBeInTheDocument();
  });

  it('показывает пустое состояние, если ничего не найдено', async () => {
    const user = userEvent.setup();

    render(<Dropdown options={options} searchable placeholder="Найти город" />);

    const input = screen.getByPlaceholderText('Найти город');

    await user.click(input);
    await user.type(input, 'xxx');

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
  });

  it('вызывает onValuesChange в режиме множественного выбора', async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();

    render(
      <Dropdown
        options={options}
        mode="multi"
        values={[]}
        onValuesChange={onValuesChange}
        placeholder="Выберите города"
      />
    );

    await user.click(screen.getByRole('button', { name: 'Выберите города' }));
    await user.click(screen.getByLabelText('Москва'));

    expect(onValuesChange).toHaveBeenCalledWith([options[0]]);
  });

  it('очищает выбранное значение в режиме одиночного выбора с очисткой', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Dropdown
        options={options}
        value={options[1]}
        onChange={onChange}
        variant="clearable"
        placeholder="Выберите город"
      />
    );

    await user.click(screen.getByRole('button', { name: 'Очистить' }));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('закрывает при клике вне компонента', async () => {
    const user = userEvent.setup();

    render(<Dropdown options={options} placeholder="Выберите город" />);

    await user.click(screen.getByRole('button', { name: 'Выберите город' }));
    expect(screen.getByText('Москва')).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByText('Москва')).not.toBeInTheDocument();
  });

  it('не открывается, если недоступен', async () => {
    const user = userEvent.setup();

    render(<Dropdown options={options} placeholder="Выберите город" disabled />);

    await user.click(screen.getByRole('button', { name: 'Выберите город' }));

    expect(screen.queryByText('Москва')).not.toBeInTheDocument();
  });

  it('снимает выбор в режиме множественного выбора, если кликнуть по уже выбранной опции', async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();

    render(
      <Dropdown
        options={options}
        mode="multi"
        values={[options[0]]}
        onValuesChange={onValuesChange}
        placeholder="Выберите города"
      />
    );

    await user.click(screen.getByRole('button', { name: 'Москва' }));
    await user.click(screen.getByLabelText('Москва'));

    expect(onValuesChange).toHaveBeenCalledWith([]);
  });

  it('очищает выбранные значения в режиме множественного выбора с clearable', async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();

    render(
      <Dropdown
        options={options}
        mode="multi"
        values={[options[0], options[1]]}
        onValuesChange={onValuesChange}
        variant="clearable"
        placeholder="Выберите города"
      />
    );

    await user.click(screen.getByRole('button', { name: 'Очистить' }));

    expect(onValuesChange).toHaveBeenCalledWith([]);
  });

  it('открывается при вводе в searchable-режиме без предварительного клика', () => {
    render(<Dropdown options={options} searchable placeholder="Найти город" />);

    const input = screen.getByPlaceholderText('Найти город');

    fireEvent.change(input, { target: { value: 'каз' } });

    expect(screen.getByText('Казань')).toBeInTheDocument();
  });
});
