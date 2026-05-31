import React from 'react';
import { Checkbox } from './checkbox';

export default {
  title: 'Checkbox',
  component: Checkbox,
};

export const Default = () => <Checkbox label="Regular checkbox" />;

export const Checked = () => <Checkbox label="Regular checked" checked readOnly />;

export const Subcategory = () => (
  <Checkbox label="Subcategory checked" isSubcategory checked readOnly />
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Checkbox
      label={checked ? 'Enabled' : 'Disabled'}
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
};
