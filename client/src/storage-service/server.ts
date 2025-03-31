import { Account, Client, Databases, ID, Query } from 'appwrite';

type ProjectKey = 'ENDPOINT' | 'PROJECT_ID' | 'DB_ID' | 'TRACKER' | 'THEME' | 'AMOUNT';

const PROJECT_KEYS: Record<ProjectKey, string> = {
  ENDPOINT: 'https://cloud.appwrite.io/v1',
  PROJECT_ID: 'VITE_PROJECT_ID',
  DB_ID: 'VITE_DATABASE_ID',
  TRACKER: 'VITE_WHOURS_TRACKER_COLLECTION_ID',
  THEME: 'VITE_WHOURS_THEME_COLLECTION_ID',
  AMOUNT: 'VITE_WHOURS_AMOUNT_COLLECTION_ID'
};

// Private
function validateCollections(): boolean {
  for (const key of Object.keys(PROJECT_KEYS)) {
    if (key.startsWith('VITE_') && !import.meta.env[key]) {
      console.error(`${import.meta.env[key]} env var not defined!`);
      return false;
    }
  }

  return true;
}

function getValue(key: ProjectKey): string {
  console.debug(`Get key value: key=${key}`);
  const keys: string[] = Object.keys(PROJECT_KEYS);
  if (keys.includes(key)) {
    let value = PROJECT_KEYS[key];
    if (value.startsWith('VITE_')) {
      value = import.meta.env[PROJECT_KEYS[key]];
    }
    console.debug(`Found! key=${key} value=${value}`);
    return value;
  }
  return '';
}

// Private
function getClient(): Client | null {
  if (!validateCollections()) {
    return null;
  }

  return new Client()
    .setEndpoint(getValue('ENDPOINT'))
    .setProject(getValue('PROJECT_ID'));
}

// Public
const getThemeForUser = async (username: string): Promise<string | null> => {
  const client = getClient();
  if (!client) {
    console.error('Unable to get Client instance');
    return null;
  }

  const databases = new Databases(client);
  const databaseId = getValue('DB_ID');
  const collectionId = getValue('THEME');

  const promise = databases.listDocuments(
    databaseId,
    collectionId,
    [
      Query.equal('username', username)
    ]
  );

  try {
    const response = await promise;
    if (response.total > 0) {
      const themeId = response.documents[0].$id;
      const theme = response.documents[0].themeKey;
      localStorage.setItem('WHOURS-THEME-ID', themeId);
      return theme;
    }
  }
  catch (error) {
    console.error('error', error);
  }

  return '';
};

const saveThemeForUser = async (username: string, theme: string): Promise<boolean> => {
  const client = getClient();
  if (!client) {
    console.error('Unable to get Client instance');
    return false;
  }

  const databases = new Databases(client);
  const databaseId: string = getValue('DB_ID');
  const collectionId: string = getValue('THEME');
  const storedThemeId: string | null = localStorage.getItem('WHOURS-THEME-ID');

  let promise;
  if (!storedThemeId) {
    promise = databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        username: username,
        themeKey: theme
      }
    );
  }
  else {
    promise = databases.updateDocument(
      databaseId,
      collectionId,
      storedThemeId,
      {
        username: username,
        themeKey: theme
      }
    );
  }

  try {
    await promise;
    return true;
  }
  catch (error) {
    console.error('error', error);
  }

  return false;
};

const signUpUser = async (email: string, password: string): Promise<string | Error | null> => {
  const client = getClient();
  if (!client) {
    console.error('Unable to get Client instance');
    return null;
  }

  const account = new Account(client);
  const promise = account.create(ID.unique(), email, password);

  try {
    const response = await promise;
    return response.$id;
  }
  catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      console.log(message);
      return error;
    }
  }

  return null;
};

const signInUser = async (email: string, password: string): Promise<string | Error | null> => {
  const client = getClient();
  if (!client) {
    console.error('Unable to get Client instance');
    return null;
  }

  const account = new Account(client);
  const promise = account.createEmailPasswordSession(email, password);

  try {
    const response = await promise;
    return response.$id;
  }
  catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      console.log(message);
      return error;
    }
  }

  return null;
};

const signOutUser = async (sessionId: string): Promise<boolean | Error | null> => {
  const client = getClient();
  if (!client) {
    console.error('Unable to get Client instance');
    return null;
  }

  const account = new Account(client);
  const promise = account.deleteSession(sessionId);

  try {
    await promise;
    return true;
  }
  catch (error) {
    if (error instanceof Error) {
      const message = error.message;
      console.log(message);
      return error;
    }
  }

  return null;
};

export {
  getThemeForUser,
  saveThemeForUser,
  signUpUser,
  signInUser,
  signOutUser
};
