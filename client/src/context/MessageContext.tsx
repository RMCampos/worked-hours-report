import React, { createContext, useState, useContext, ReactNode } from 'react';

type MessageType = 'error' | 'loading' | null;

interface MessageContextType {
  messageType: MessageType;
  message: string;
  showMessage: (type: MessageType, message: string) => void;
  hideMessage: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [messageType, setMessageType] = useState<MessageType>(null);
  const [message, setMessage] = useState<string>('');

  const showMessage = (type: MessageType, text: string) => {
    setMessageType(type);
    setMessage(text);
  };

  const hideMessage = () => {
    setMessageType(null);
    setMessage('');
  };

  return (
    <MessageContext.Provider
      value={{ messageType, message, showMessage, hideMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
