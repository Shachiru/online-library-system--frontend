import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { isTokenExpired } from "./auth/auth.ts";
import { DefaultLayout } from "./view/common/DefaultLayout/DefaultLayout.tsx";
import { AuthPage } from "./view/pages/Auth/AuthPage.tsx";

function App() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const isAuthRoute = ['/login', '/signup'].includes(location.pathname);
        if (!isAuthRoute && (!token || isTokenExpired(token))) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate, location.pathname]);

    return (
        <Routes>
            <Route path="/*" element={<DefaultLayout/>}></Route>
            <Route path="/auth" element={<AuthPage/>}></Route>
            <Route path="/login" element={<AuthPage/>}></Route>
            <Route path="/signup" element={<AuthPage/>}></Route>
        </Routes>
    );
}

export default App;