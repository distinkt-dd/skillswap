import { type FC, type ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { selectedUser, selectedUserIsAuthChecked } from '@entities/user';
import { useSelector } from '@shared/store';

type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({ children, onlyUnAuth = false }) => {
  const user = useSelector(selectedUser);
  const isAuthChecked = useSelector(selectedUserIsAuthChecked);
  const location = useLocation();
  if (!isAuthChecked) {
    return <></>;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return children;
};
