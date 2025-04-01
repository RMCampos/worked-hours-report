import React from 'react';
import { createContext, useMemo, useState } from 'react';
import { signUpUser, signInUser, signOutUser } from '../storage-service/server';

export interface AuthContextData {
  signed: boolean;
  username: string;
  checkLogin: () => boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signed, setSigned] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
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

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      await signUpUser(email, password);
      const response = await signInUser(email, password);
      signinUserPriv(email, response);
    }
    catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const response: string = await signInUser(email, password);
      signinUserPriv(email, response);
    }
    catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
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
    setUsername('');
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
