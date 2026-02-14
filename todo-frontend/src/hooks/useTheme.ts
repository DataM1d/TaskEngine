import { useState, useEffect } from 'react';

export function useTheme() {
    const [isDarkMode, setIsDarkMode] = useState(() => 
    localStorage.getItem('theme') == 'dark'
   );

   useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
   }, [isDarkMode]);

   return { isDarkMode, setIsDarkMode };
}