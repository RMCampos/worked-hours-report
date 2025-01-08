import { REDIRECT_PATH } from '../app-constants/app-constants';

/**
 *
 */
function getStoredPath() {
  const root: string = '/';
  const home: string = '/home';

  const storedPath: string | null = localStorage.getItem(REDIRECT_PATH);
  if (storedPath) {
    localStorage.removeItem(REDIRECT_PATH);
    return storedPath === root ? home : storedPath;
  }
  return home;
}

export default getStoredPath;
