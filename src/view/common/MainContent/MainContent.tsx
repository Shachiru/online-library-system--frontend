import {Route, Routes} from "react-router-dom";
import {HomePage} from "../../pages/HomePage/HomePage";
import {BorrowBookPage} from "../../pages/BorrowBookPage/BookBorrowPage";
import {AdminBookPage} from "../../pages/AdminBookPage/AdminBookPage";

export function MainContent() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/borrow" element={<BorrowBookPage/>}/>
            <Route path="/admin/books/add" element={<AdminBookPage/>}/>
        </Routes>
    );
}