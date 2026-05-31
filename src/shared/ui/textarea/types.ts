export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel';
export type InputVariant = 'default' | 'search';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
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
