import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { init, miniApp, viewport, themeParams, initData } from '@telegram-apps/sdk';

interface TelegramContextType {
  user: {
    id: number;
    firstName?: string;
    lastName?: string;
    username?: string;
  } | null;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  isReady: false,
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  const [user, setUser] = useState<TelegramContextType['user']>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      init();

      if (miniApp.mount.isAvailable()) {
        miniApp.mount();
        miniApp.ready();
      }

      if (viewport.mount.isAvailable()) {
        viewport.mount();
        viewport.expand();
      }

      if (themeParams.mount.isAvailable()) {
        themeParams.mount();
        const root = document.documentElement;
        root.style.setProperty('--tg-bg-color', themeParams.backgroundColor() || '#0f0f23');
        root.style.setProperty('--tg-text-color', themeParams.textColor() || '#ffffff');
      }

      if (initData.restore()) {
        const userData = initData.user();
        if (userData) {
          setUser({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
          });
        }
      }

      setIsReady(true);
    } catch (error) {
      console.log('Not running in Telegram, using fallback mode');
      setIsReady(true);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ user, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
};
