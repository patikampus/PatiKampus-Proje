import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Review from './pages/Review';
import DevicePanel from './pages/DevicePanel';
import PageLayout from './layout/PageLayout';

function App() {
  return (
    <Router>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/review" element={<Review />} />
          <Route path="/device-panel" element={<DevicePanel />} />
        </Routes>
      </PageLayout>
    </Router>
  );
}

export default App;
