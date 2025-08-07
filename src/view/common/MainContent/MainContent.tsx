import {Route, Routes} from "react-router-dom";
import {HomePage} from "../../pages/HomePage/HomePage";
import {BorrowBookPage} from "../../pages/BorrowBookPage/BookBorrowPage";
import {ProfilePage} from "../../pages/ProfilePage/ProfilePage.tsx";
import {BookPage} from "../../pages/BookPage/BookPage.tsx";

export function MainContent() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/books" element={<BookPage/>}/>
            <Route path="/borrow" element={<BorrowBookPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
        </Routes>
    );
}