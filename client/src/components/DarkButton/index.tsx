import React, { useEffect } from 'react';
import { useTheme } from '../../context/themeContext';
import './style.css';
import { getTheme, saveTheme } from '../../storage-service/storage';

function DarkButton(): React.ReactNode {
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = (): void => {
    const themeToSet = theme === 'light' ? 'dark' : 'light';
    setTheme(themeToSet);

    // body
    const enableDark = theme === 'light';
    let bodyClasses: string = document.body.classList.value.trim();
    if (enableDark) {
      bodyClasses = bodyClasses.replace('text-bg-light', '');
      bodyClasses += ' text-bg-dark';
    }
    else {
      bodyClasses = bodyClasses.replace('text-bg-dark', '');
      bodyClasses += ' text-bg-light';
    }
    document.body.classList.value = bodyClasses;

    // Save it to local storage
    saveTheme(themeToSet);
  };

  const localSavedTheme = (): void => {
    const savedTheme = getTheme();
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
    }

    if (savedTheme === 'light') {
      if (!document.body.classList.value.includes('text-bg-light')) {
        document.body.classList.value = 'text-bg-light';
      }
    }
    else if (savedTheme === 'dark') {
      if (!document.body.classList.value.includes('text-bg-dark')) {
        document.body.classList.value = 'text-bg-dark';
      }
    }
  };

  useEffect(() => {
    localSavedTheme();
  }, []);

  return (
    <button
      type="button"
      className="btn btn-dark"
      onClick={toggleDarkMode}
    >
      Toggle Dark Mode
    </button>
  );
}

export default DarkButton;
