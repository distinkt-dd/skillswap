import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('отрисовывает изображение аватара и обрабатывает клик по нему', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Avatar src="/avatar.png" size="small" onClick={onClick} />);

    const image = screen.getByRole('img', { name: 'Avatar' });

    expect(image).toHaveAttribute('src', '/avatar.png');

    await user.click(image);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('отрисовывает кнопку редактирования, если editable=true', async () => {
    const user = userEvent.setup();
    const avatarChangeBtnClick = vi.fn();

    render(
      <Avatar
        src="/avatar.png"
        size="medium"
        editable
        avatarChangeBtnClick={avatarChangeBtnClick}
      />
    );

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(avatarChangeBtnClick).toHaveBeenCalledTimes(1);
  });
});
