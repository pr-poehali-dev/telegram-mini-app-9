import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TelegramContextType {
  user: {
    id: number;
    firstName?: string;
    lastName?: string;
    username?: string;
  } | null;
  isReady: boolean;
  webApp: any;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  isReady: false,
  webApp: null,
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  const [user, setUser] = useState<TelegramContextType['user']>(null);
  const [isReady, setIsReady] = useState(false);
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      tg.expand();
      
      setWebApp(tg);
      
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        setUser({
          id: tgUser.id,
          firstName: tgUser.first_name,
          lastName: tgUser.last_name,
          username: tgUser.username,
        });
      }
      
      const root = document.documentElement;
      root.style.setProperty('--tg-theme-bg-color', tg.backgroundColor || '#0f0f23');
      root.style.setProperty('--tg-theme-text-color', tg.textColor || '#ffffff');
      root.style.setProperty('--tg-theme-hint-color', tg.hintColor || '#708499');
      root.style.setProperty('--tg-theme-link-color', tg.linkColor || '#6ab2f2');
      root.style.setProperty('--tg-theme-button-color', tg.buttonColor || '#5288c1');
      root.style.setProperty('--tg-theme-button-text-color', tg.buttonTextColor || '#ffffff');
    }
    
    setIsReady(true);
  }, []);

  return (
    <TelegramContext.Provider value={{ user, isReady, webApp }}>
      {children}
    </TelegramContext.Provider>
  );
};
