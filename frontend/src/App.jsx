import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';

function App() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login';

    if (isAuthPage) {
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
