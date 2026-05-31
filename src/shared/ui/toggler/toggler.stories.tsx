import { Toggler } from './toggler';
import React from 'react';

export default {
  title: 'Toggler',
  component: Toggler,
};

export const Default = () => <Toggler label="Receive updates" />;

export const Checked = () => <Toggler label="Public profile" checked readOnly />;

export const Disabled = () => <Toggler label="Disabled toggle" defaultChecked disabled />;

export const Controlled = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Toggler
      label={checked ? 'Notifications on' : 'Notifications off'}
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
};
