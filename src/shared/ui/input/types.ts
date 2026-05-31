export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel';
export type InputVariant = 'default' | 'search';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: InputType;
  name?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  variant?: InputVariant;
  fullWidth?: boolean;
  width?: string | number;
  className?: string;
  style?: React.CSSProperties;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
}
