import {createContext} from 'react';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
};

// Create context
export const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleTheme: () => {
    },
});