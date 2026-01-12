import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initMiniApp, initViewport, initThemeParams, type MiniApp } from '@telegram-apps/sdk';

interface TelegramContextType {
  miniApp: MiniApp | null;
  user: {
    id: number;
    firstName?: string;
    lastName?: string;
    username?: string;
  } | null;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  miniApp: null,
  user: null,
  isReady: false,
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  const [miniApp, setMiniApp] = useState<MiniApp | null>(null);
  const [user, setUser] = useState<TelegramContextType['user']>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const [miniAppInstance] = initMiniApp();
      const [viewport] = initViewport();
      const [themeParams] = initThemeParams();

      miniAppInstance.ready();
      viewport?.expand();

      setMiniApp(miniAppInstance);

      if (miniAppInstance.initData?.user) {
        setUser({
          id: miniAppInstance.initData.user.id,
          firstName: miniAppInstance.initData.user.firstName,
          lastName: miniAppInstance.initData.user.lastName,
          username: miniAppInstance.initData.user.username,
        });
      }

      const root = document.documentElement;
      root.style.setProperty('--tg-bg-color', themeParams?.backgroundColor || '#0f0f23');
      root.style.setProperty('--tg-text-color', themeParams?.textColor || '#ffffff');

      setIsReady(true);
    } catch (error) {
      console.log('Not running in Telegram, using fallback mode');
      setIsReady(true);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ miniApp, user, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
};
