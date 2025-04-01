import { Account, Client, Databases, ID, Query } from 'appwrite';
import { TodayTrackerStore } from '../types/todayTrackerStore';
import { MonthAmount } from '../types/monthAmount';

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
      return error.message;
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
      return error.message;
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
      return error;
    }
  }

  return null;
};

const getTimesForUserAndDay = async (username: string, day: string): Promise<TodayTrackerStore | null> => {
  const client = getClient();
  if (!client) {
    console.error('Unable to get Client instance');
    return null;
  }

  const databases = new Databases(client);
  const databaseId = getValue('DB_ID');
  const collectionId = getValue('TRACKER');

  const promise = databases.listDocuments(
    databaseId,
    collectionId,
    [
      Query.equal('username', username),
      Query.equal('day', day)
    ]
  );

  try {
    const response = await promise;
    if (response.total > 0) {
      const document = response.documents[0];

      return {
        day: document.day,
        time1: document.time1 || '',
        time2: document.time2 || '',
        time3: document.time3 || '',
        time4: document.time4 || '',
        time5: document.time5 || '',
        time6: document.time6 || '',
        totalWorkedHours: document.totalWorkedHours || '',
        willCompleteAt: document.willCompleteAt || '',
        timeLeft: document.timeLeft || '',
        extraHours: document.extraHours || '',
        documentId: document.$id
      };
    }
  }
  catch (error) {
    console.error('error', error);
    // TODO: handle error
  }

  return null;
};

const createTimeForUserAndDay = async (username: string, day: string, tracker: TodayTrackerStore): Promise<string | null> => {
  const client = getClient();
  if (!client) {
    console.error('Unable to get Client instance');
    return null;
  }

  const databases = new Databases(client);
  const databaseId = getValue('DB_ID');
  const collectionId = getValue('TRACKER');

  const promise = databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      username: username,
      day: day,
      time1: tracker.time1,
      time2: tracker.time2,
      time3: tracker.time3,
      time4: tracker.time4,
      time5: tracker.time5,
      time6: tracker.time6,
      totalWorkedHours: tracker.totalWorkedHours,
      willCompleteAt: tracker.willCompleteAt,
      timeLeft: tracker.timeLeft,
      extraHours: tracker.extraHours
    }
  );

  try {
    const response = await promise;
    return response.$id;
  }
  catch (error) {
    console.error('error', error);
    // TODO: handle error
  }

  return null;
};

const updateTimesForUserAndDay = async (username: string, day: string, tracker: TodayTrackerStore): Promise<boolean> => {
  const client = getClient();
  if (!client) {
    console.error('Unable to get Client instance');
    return false;
  }

  if (!tracker.documentId) {
    console.error('No document id provided');
    return false;
  }

  const databases = new Databases(client);
  const databaseId = getValue('DB_ID');
  const collectionId = getValue('TRACKER');

  const promise = databases.updateDocument(
    databaseId,
    collectionId,
    tracker.documentId,
    {
      username: username,
      day: day,
      time1: tracker.time1,
      time2: tracker.time2,
      time3: tracker.time3,
      time4: tracker.time4,
      time5: tracker.time5,
      time6: tracker.time6,
      totalWorkedHours: tracker.totalWorkedHours,
      willCompleteAt: tracker.willCompleteAt,
      timeLeft: tracker.timeLeft,
      extraHours: tracker.extraHours
    }
  );

  try {
    await promise;
    return true;
  }
  catch (error) {
    console.error('error', error);
    // TODO: handle error
  }

  return false;
};

const getAllTimesForUserAndPeriod = async (username: string, period: string): Promise<TodayTrackerStore[]> => {
  const client = getClient();
  if (!client) {
    console.error('Unable to get Client instance');
    return [];
  }

  const databases = new Databases(client);
  const databaseId = getValue('DB_ID');
  const collectionId = getValue('TRACKER');

  const promise = databases.listDocuments(
    databaseId,
    collectionId,
    [
      Query.equal('username', username),
      Query.startsWith('day', period) // E.g.: 2025/3
    ]
  );

  try {
    const response = await promise;
    if (response.total > 0) {
      const result: TodayTrackerStore[] = [];
      for (let i = 0; i < response.documents.length; i++) {
        result.push({
          day: response.documents[i].day,
          time1: response.documents[i].time1 || '',
          time2: response.documents[i].time2 || '',
          time3: response.documents[i].time3 || '',
          time4: response.documents[i].time4 || '',
          time5: response.documents[i].time5 || '',
          time6: response.documents[i].time6 || '',
          totalWorkedHours: response.documents[i].totalWorkedHours || '',
          willCompleteAt: response.documents[i].willCompleteAt || '',
          timeLeft: response.documents[i].timeLeft || '',
          extraHours: response.documents[i].extraHours || '',
          documentId: response.documents[i].$id
        });
      }
      return result;
    }
  }
  catch (error) {
    console.error('error', error);
    // TODO: handle error
  }

  return [];
};

const getMonthAmountForUserAndPeriod = async (username: string, period: string): Promise<MonthAmount | null> => {
  const client = getClient();
  if (!client) {
    console.error('Unable to get Client instance');
    return null;
  }

  const databases = new Databases(client);
  const databaseId = getValue('DB_ID');
  const collectionId = getValue('AMOUNT');

  const promise = databases.listDocuments(
    databaseId,
    collectionId,
    [
      Query.equal('username', username),
      Query.equal('period', period)
    ]
  );

  try {
    const response = await promise;
    if (response.total > 0) {
      const document = response.documents[0];

      return {
        amount: document.amountOfMinutes,
        documentId: document.$id
      };
    }
  }
  catch (error) {
    console.error('error', error);
    // TODO: handle error
  }

  return null;
};

export {
  getThemeForUser,
  saveThemeForUser,
  signUpUser,
  signInUser,
  signOutUser,
  getTimesForUserAndDay,
  getAllTimesForUserAndPeriod,
  getMonthAmountForUserAndPeriod,
  createTimeForUserAndDay,
  updateTimesForUserAndDay
};
