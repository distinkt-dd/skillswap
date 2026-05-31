import type { SVGProps } from 'react';

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export type IconName = keyof IconsMap;

export type IconsMap = {
  google: React.FC<SVGProps<SVGSVGElement>>;
  apple: React.FC<SVGProps<SVGSVGElement>>;
  add: React.FC<SVGProps<SVGSVGElement>>;
  arrowLeft: React.FC<SVGProps<SVGSVGElement>>;
  arrowSquareLeft: React.FC<SVGProps<SVGSVGElement>>;
  arrowSquareRight: React.FC<SVGProps<SVGSVGElement>>;
  book: React.FC<SVGProps<SVGSVGElement>>;
  briefcase: React.FC<SVGProps<SVGSVGElement>>;
  calendar: React.FC<SVGProps<SVGSVGElement>>;
  checkboxDone: React.FC<SVGProps<SVGSVGElement>>;
  checkboxEmpty: React.FC<SVGProps<SVGSVGElement>>;
  checkboxRemove: React.FC<SVGProps<SVGSVGElement>>;
  chevronDown: React.FC<SVGProps<SVGSVGElement>>;
  chevronLeft: React.FC<SVGProps<SVGSVGElement>>;
  chevronRight: React.FC<SVGProps<SVGSVGElement>>;
  chevronUp: React.FC<SVGProps<SVGSVGElement>>;
  clock: React.FC<SVGProps<SVGSVGElement>>;
  count: React.FC<SVGProps<SVGSVGElement>>;
  cross: React.FC<SVGProps<SVGSVGElement>>;
  done: React.FC<SVGProps<SVGSVGElement>>;
  edit: React.FC<SVGProps<SVGSVGElement>>;
  eyeSlash: React.FC<SVGProps<SVGSVGElement>>;
  eye: React.FC<SVGProps<SVGSVGElement>>;
  filterSquare: React.FC<SVGProps<SVGSVGElement>>;
  galleryAdd: React.FC<SVGProps<SVGSVGElement>>;
  galleryEdit: React.FC<SVGProps<SVGSVGElement>>;
  global: React.FC<SVGProps<SVGSVGElement>>;
  home: React.FC<SVGProps<SVGSVGElement>>;
  idea: React.FC<SVGProps<SVGSVGElement>>;
  lifestyle: React.FC<SVGProps<SVGSVGElement>>;
  like: React.FC<SVGProps<SVGSVGElement>>;
  likeFilled: React.FC<SVGProps<SVGSVGElement>>;
  logout: React.FC<SVGProps<SVGSVGElement>>;
  messageText: React.FC<SVGProps<SVGSVGElement>>;
  moon: React.FC<SVGProps<SVGSVGElement>>;
  moreSquare: React.FC<SVGProps<SVGSVGElement>>;
  notification: React.FC<SVGProps<SVGSVGElement>>;
  pallete: React.FC<SVGProps<SVGSVGElement>>;
  plusCircle: React.FC<SVGProps<SVGSVGElement>>;
  radioButtonActive: React.FC<SVGProps<SVGSVGElement>>;
  radioButtonEmpty: React.FC<SVGProps<SVGSVGElement>>;
  request: React.FC<SVGProps<SVGSVGElement>>;
  scroll: React.FC<SVGProps<SVGSVGElement>>;
  scrollSquare: React.FC<SVGProps<SVGSVGElement>>;
  search: React.FC<SVGProps<SVGSVGElement>>;
  share: React.FC<SVGProps<SVGSVGElement>>;
  sort: React.FC<SVGProps<SVGSVGElement>>;
  sun: React.FC<SVGProps<SVGSVGElement>>;
  userCircle: React.FC<SVGProps<SVGSVGElement>>;
  user: React.FC<SVGProps<SVGSVGElement>>;
  logo: React.FC<SVGProps<SVGSVGElement>>;
  refresh: React.FC<SVGProps<SVGSVGElement>>;
};
