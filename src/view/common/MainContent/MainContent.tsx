import {Route, Routes} from "react-router-dom";
import {HomePage} from "../../pages/HomePage/HomePage.tsx";

export function MainContent() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}></Route>
        </Routes>
    );
}