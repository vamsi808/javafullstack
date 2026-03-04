import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/common/Navbar';
import { useAuth } from './context/AuthContext';

function App() {
    const { user, loading } = useAuth();
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/set-password' || location.pathname === '/register';
    const isPortal = location.pathname === '/portal';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-start text-white">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Hide navbar for auth pages, customers, or when not logged in
    if (isAuthPage || isPortal || !user || user.role !== 'ADMIN') {
        return <AppRoutes />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-start">
            <Navbar />
            <main className="flex-1 overflow-y-auto">
                <AppRoutes />
            </main>
        </div>
    );
}

export default App;
