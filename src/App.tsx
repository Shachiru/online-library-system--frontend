import {Route, Routes, useNavigate} from 'react-router-dom';
import {useEffect} from "react";
import {isTokenExpired} from "./auth/auth.ts";
import {DefaultLayout} from "./view/common/DefaultLayout/DefaultLayout.tsx";
import {Login} from "./view/pages/Login/Login.tsx";

function App() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || isTokenExpired(token)){
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);
    return (
        <Routes>
            <Route path="/*" element={<DefaultLayout/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
        </Routes>
    );
}

export default App;