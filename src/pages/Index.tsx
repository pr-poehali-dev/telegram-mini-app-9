import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HomePage } from '@/components/HomePage';
import { PortfolioPage } from '@/components/PortfolioPage';
import { WalletPage } from '@/components/WalletPage';
import { BonusPage, PartnersPage } from '@/components/BonusPartnersPages';
import { useRobokassa, openPaymentPage } from '@/components/extensions/robokassa/useRobokassa';
import { useToast } from '@/hooks/use-toast';

type Page = 'home' | 'portfolio' | 'wallet' | 'bonus' | 'partners';

const Index = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'crypto' | 'sbp' | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const { toast } = useToast();

  const { createPayment, isLoading } = useRobokassa({
    apiUrl: 'https://functions.poehali.dev/d44905e6-9c67-483c-9afb-6d1cfeaa6bc9',
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const balance = 125000;
  const profit24h = 2450;
  const partnersCount = 48;
  const withdrawn = 85000;
  const portfolioTotal = 125000;
  const dailyIncome = 2450;
  const invested = 100000;
  const currentProfit = 25000;
  const referralIncome = 15840;
  const activePartners = 32;
  const totalPartners = 48;

  const tasks = [
    { id: 'chat', title: 'Подписка на чат', reward: 100 },
    { id: 'friends', title: 'Пригласить 15 друзей', reward: 200 },
  ];

  const tariffs = [
    { name: 'Старт', amount: 10000, daily: 200, progress: 45 },
    { name: 'Стандарт', amount: 50000, daily: 1200, progress: 78 },
    { name: 'Премиум', amount: 100000, daily: 2500, progress: 25 },
  ];

  const operations = [
    { type: 'deposit', amount: 25000, date: '10.01.2026' },
    { type: 'profit', amount: 2450, date: '10.01.2026' },
    { type: 'withdrawal', amount: 10000, date: '09.01.2026' },
  ];

  const handleTaskComplete = (taskId: string, reward: number) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const handlePayment = async () => {
    const amount = parseFloat(depositAmount);
    
    if (!amount || amount < 100) {
      toast({
        title: 'Ошибка',
        description: 'Минимальная сумма пополнения — 100 ₽',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await createPayment({
        amount,
        userName: 'Пользователь',
        userEmail: 'user@example.com',
        userPhone: '+79999999999',
        cartItems: [
          {
            id: 'deposit',
            name: 'Пополнение баланса',
            price: amount,
            quantity: 1,
          },
        ],
        successUrl: window.location.origin + '/?payment=success',
        failUrl: window.location.origin + '/?payment=fail',
      });

      openPaymentPage(response.payment_url);
      setIsDepositOpen(false);
      setSelectedMethod(null);
      setDepositAmount('');
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const pages = {
    home: (
      <HomePage
        balance={balance}
        profit24h={profit24h}
        partnersCount={partnersCount}
        withdrawn={withdrawn}
        operations={operations}
        onDepositClick={() => setIsDepositOpen(true)}
      />
    ),
    portfolio: (
      <PortfolioPage
        portfolioTotal={portfolioTotal}
        dailyIncome={dailyIncome}
        tariffs={tariffs}
        invested={invested}
        currentProfit={currentProfit}
      />
    ),
    wallet: <WalletPage balance={balance} onDepositClick={() => setIsDepositOpen(true)} />,
    bonus: (
      <BonusPage
        tasks={tasks}
        completedTasks={completedTasks}
        onTaskComplete={handleTaskComplete}
      />
    ),
    partners: (
      <PartnersPage
        referralIncome={referralIncome}
        totalPartners={totalPartners}
        activePartners={activePartners}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="max-w-md mx-auto relative">
        <div className="p-6">{pages[activePage]}</div>

        <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
          <DialogContent className="glass border-border max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Пополнить баланс</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Выберите удобный способ пополнения
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              <Card
                className={`glass border-0 p-5 cursor-pointer hover-scale transition-all ${
                  selectedMethod === 'crypto' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMethod('crypto')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 gradient-blue rounded-full flex items-center justify-center">
                    <Icon name="Bitcoin" size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold">Криптокошелек</div>
                    <div className="text-sm text-muted-foreground">USDT, BTC, ETH</div>
                  </div>
                  {selectedMethod === 'crypto' && (
                    <Icon name="CheckCircle" className="text-primary" size={24} />
                  )}
                </div>
              </Card>

              <Card
                className={`glass border-0 p-5 cursor-pointer hover-scale transition-all ${
                  selectedMethod === 'sbp' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMethod('sbp')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 gradient-purple rounded-full flex items-center justify-center">
                    <Icon name="Smartphone" size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold">СБП</div>
                    <div className="text-sm text-muted-foreground">Система быстрых платежей</div>
                  </div>
                  {selectedMethod === 'sbp' && (
                    <Icon name="CheckCircle" className="text-primary" size={24} />
                  )}
                </div>
              </Card>
            </div>

            {selectedMethod && (
              <div className="mt-6 space-y-4 animate-fade-in">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Сумма пополнения
                  </label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-background/50 border-border h-12 text-lg"
                  />
                </div>
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full gradient-purple hover:opacity-90 transition-opacity h-12 text-base font-semibold"
                >
                  {isLoading ? 'Загрузка...' : 'Продолжить'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="fixed bottom-0 left-0 right-0 glass border-t border-border">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              {[
                { id: 'home', icon: 'Home', label: 'Главная' },
                { id: 'portfolio', icon: 'Briefcase', label: 'Портфель' },
                { id: 'wallet', icon: 'Wallet', label: 'Кошелек' },
                { id: 'bonus', icon: 'Gift', label: 'Бонус' },
                { id: 'partners', icon: 'Users', label: 'Партнеры' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id as Page)}
                  className={`flex flex-col items-center gap-1 min-w-[60px] transition-all ${
                    activePage === item.id ? 'scale-110' : 'opacity-50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-full transition-all ${
                      activePage === item.id ? 'gradient-purple' : ''
                    }`}
                  >
                    <Icon name={item.icon as any} size={20} />
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;