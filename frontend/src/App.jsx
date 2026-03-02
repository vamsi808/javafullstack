import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';

function App() {
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
