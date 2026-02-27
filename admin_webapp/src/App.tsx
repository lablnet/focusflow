import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Teams from './pages/Teams';
import Login from './pages/Login';
import { useUserStore } from './store/userStore';

const App = () => {
  const session = useUserStore((state) => state.session);
  const isAuthenticated = !!session;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/*"
          element={
            // isAuthenticated ? (
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/settings" element={<div className="text-white p-8">Settings Coming Soon</div>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </MainLayout>
            // ) : (
            //   <Navigate to="/login" />
            // )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
