import { Navigate, Outlet } from 'react-router-dom';
import PageLayout from './layout/PageLayout';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
};

export default ProtectedRoute;
