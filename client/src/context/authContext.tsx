import React from 'react';
import { createContext, useMemo, useState } from 'react';
import { signUpUser, signInUser, signOutUser } from '../storage-service/server';

export interface AuthContextData {
  signed: boolean;
  username: string | null;
  checkLogin: () => boolean;
  signUp: (email: string, password: string) => Promise<Error | boolean>;
  signIn: (email: string, password: string) => Promise<Error | boolean>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signed, setSigned] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const signinUserPriv = (username: string, sessionId: string) => {
    setSigned(true);
    setUsername(username);
    setSessionId(sessionId);

    const userData = {
      username: username,
      sessionId: sessionId
    };

    localStorage.setItem('WHOURS-USER-DATA', JSON.stringify(userData));
  };

  const signUp = async (email: string, password: string): Promise<Error | boolean> => {
    let response: string | Error | null = await signUpUser(email, password);
    if (!response || typeof response !== 'string') {
      return false;
    }

    response = await signInUser(email, password);
    if (response && typeof response === 'string') {
      signinUserPriv(email, response);
      return true;
    }

    if (response instanceof Error) {
      return response;
    }

    return false;
  };

  const signIn = async (email: string, password: string): Promise<Error | boolean> => {
    const response: string | Error | null = await signInUser(email, password);
    if (response && typeof response === 'string') {
      signinUserPriv(email, response);
      return true;
    }
    if (response instanceof Error) {
      return response;
    }
    return false;
  };

  const checkLogin = (): boolean => {
    const savedData: string | null = localStorage.getItem('WHOURS-USER-DATA');
    if (savedData) {
      const userData = JSON.parse(savedData);
      signinUserPriv(userData.username, userData.sessionId);
      return true;
    }
    return false;
  };

  const signOut = async (): Promise<void> => {
    if (sessionId) {
      await signOutUser(sessionId);
    }
    localStorage.removeItem('WHOURS-USER-DATA');
    setSigned(false);
    setUsername(null);
    setSessionId(null);
  };

  const contextValue: AuthContextData = useMemo(() => ({
    signed,
    username,
    checkLogin,
    signUp,
    signIn,
    signOut
  }), [signed, username, checkLogin, signUp, signIn, signOut]);

  return (
    <AuthContext.Provider value={contextValue}>
      { children }
    </AuthContext.Provider>
  );
};
