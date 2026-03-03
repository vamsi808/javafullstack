import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import { useAuth } from './context/AuthContext';

function App() {
    const { user, loading } = useAuth();
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/set-password';
    const isPortal = location.pathname === '/portal';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-start text-white">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Hide sidebar/navbar for auth pages, customers, or when not logged in
    if (isAuthPage || isPortal || !user || user.role !== 'ADMIN') {
        return <AppRoutes />;
    }

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main className="content-area">
                    <AppRoutes />
                </main>
            </div>
        </div>
    );
}

export default App;
