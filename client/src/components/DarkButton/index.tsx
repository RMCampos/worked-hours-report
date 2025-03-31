import React, { useContext, useEffect } from 'react';
import { useTheme } from '../../context/themeContext';
import { getThemeForUser, saveThemeForUser } from '../../storage-service/server';
import './style.css';
import { AuthContext } from '../../context/authContext';

function DarkButton(): React.ReactNode {
  const { theme, setTheme } = useTheme();
  const { username } = useContext(AuthContext);

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

    if (username) {
      saveThemeForUser(username, themeToSet);
    }
  };

  const localSavedTheme = async (): Promise<void> => {
    if (username) {
      const themeFromServer = await getThemeForUser(username);
      if (themeFromServer) {
        if (themeFromServer === 'light') {
          if (!document.body.classList.value.includes('text-bg-light')) {
            document.body.classList.value = 'text-bg-light';
          }
        }
        else if (themeFromServer === 'dark') {
          if (!document.body.classList.value.includes('text-bg-dark')) {
            document.body.classList.value = 'text-bg-dark';
          }
        }
        setTheme(themeFromServer);
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
