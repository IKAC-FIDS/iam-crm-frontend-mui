import { Outlet } from 'react-router-dom';
import { RouteAccessGuard } from './RouteAccessGuard';

export function ProtectedRoute() {
  return <RouteAccessGuard policy={{ type: 'authenticated' }}><Outlet /></RouteAccessGuard>;
}
