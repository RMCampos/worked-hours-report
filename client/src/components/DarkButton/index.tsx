import React, { useContext, useEffect } from 'react';
import { useTheme } from '../../context/themeContext';
import { getThemeForUser, saveThemeForUser } from '../../storage-service/server';
import { AuthContext } from '../../context/authContext';
import { useMessage } from '../../context/MessageContext';
import { getError } from '../../services/ErrorService';
import './style.css';

function DarkButton(): React.ReactNode {
  const { theme, setTheme } = useTheme();
  const { username, signed } = useContext(AuthContext);
  const { showMessage } = useMessage();

  const toggleDarkMode = (): void => {
    const themeToSet = theme === 'light' ? 'dark' : 'light';
    setTheme(themeToSet);

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

  const loadSavedTheme = async (): Promise<void> => {
    if (signed) {
      try {
        const themeFromServer = await getThemeForUser(username);

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
      catch (error) {
        showMessage('error', getError(error));
      }
    }
  };

  useEffect(() => {
    loadSavedTheme();
  }, [signed]);

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
