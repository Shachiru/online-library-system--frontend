import {NavBar} from "../NavBar/NavBar.tsx";
import {MainContent} from "../MainContent/MainContent.tsx";
import {Footer} from "../Footer/Footer.tsx";

export function DefaultLayout() {
    return (
        <div className="min-h-screen bg-primary-white dark:bg-dark-bg transition-colors duration-300">
            <NavBar/>
            <MainContent/>
            <Footer/>
        </div>
    );
}