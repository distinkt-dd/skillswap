import React from 'react';
import { Radio } from './radio';

export default {
  title: 'Radio',
  component: Radio,
};

export const Default = () => <Radio name="demo" label="1" />;

export const Checked = () => <Radio name="demo-checked" label="1" checked readOnly />;

export const Group = () => {
  const [value, setValue] = React.useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Radio
        name="group"
        value="a"
        checked={value === 'a'}
        onChange={() => setValue('a')}
        label="1"
      />
      <Radio
        name="group"
        value="b"
        checked={value === 'b'}
        onChange={() => setValue('b')}
        label="2"
      />
    </div>
  );
};
