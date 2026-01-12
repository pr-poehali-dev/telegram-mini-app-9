import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Page = 'home' | 'portfolio' | 'wallet' | 'bonus' | 'partners';

const Index = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'crypto' | 'sbp' | null>(null);

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

  const renderHome = () => (
    <div className="space-y-4 pb-24">
      <Card className="glass border-0 p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">Баланс</div>
          <div className="text-5xl font-bold gradient-purple bg-clip-text text-transparent">
            ₽{balance.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <div className="text-xs text-muted-foreground">Прибыль 24ч</div>
            <div className="text-lg font-semibold text-green-400">
              +₽{profit24h.toLocaleString()}
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-xs text-muted-foreground">Партнеры</div>
            <div className="text-lg font-semibold">{partnersCount}</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-xs text-muted-foreground">Выведено</div>
            <div className="text-lg font-semibold">₽{(withdrawn / 1000).toFixed(0)}к</div>
          </div>
        </div>
      </Card>

      <Button onClick={() => setIsDepositOpen(true)} className="w-full gradient-purple hover:opacity-90 transition-opacity h-14 text-lg font-semibold">
        <Icon name="Plus" className="mr-2" size={20} />
        Пополнить баланс
      </Button>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold px-2">История операций</h3>
        {operations.map((op, idx) => (
          <Card key={idx} className="glass border-0 p-4 flex items-center justify-between hover-scale">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  op.type === 'deposit'
                    ? 'gradient-blue'
                    : op.type === 'profit'
                    ? 'gradient-purple'
                    : 'gradient-orange'
                }`}
              >
                <Icon
                  name={
                    op.type === 'deposit'
                      ? 'ArrowDownToLine'
                      : op.type === 'profit'
                      ? 'TrendingUp'
                      : 'ArrowUpFromLine'
                  }
                  size={18}
                />
              </div>
              <div>
                <div className="font-medium">
                  {op.type === 'deposit'
                    ? 'Пополнение'
                    : op.type === 'profit'
                    ? 'Прибыль'
                    : 'Вывод'}
                </div>
                <div className="text-xs text-muted-foreground">{op.date}</div>
              </div>
            </div>
            <div
              className={`font-semibold ${
                op.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {op.type === 'withdrawal' ? '-' : '+'}₽{op.amount.toLocaleString()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-4 pb-24">
      <div className="text-2xl font-bold mb-4">Мой портфель</div>

      <Card className="glass border-0 p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Всего вложено</div>
            <div className="text-3xl font-bold">₽{portfolioTotal.toLocaleString()}</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-sm text-muted-foreground">Доход в сутки</div>
            <div className="text-2xl font-bold text-green-400">
              +₽{dailyIncome.toLocaleString()}
            </div>
          </div>
        </div>
      </Card>

      <Card className="glass border-0 p-6 space-y-4">
        <div className="text-lg font-semibold">Калькулятор доходности</div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Сумма инвестиции</label>
            <Input
              type="number"
              placeholder="10000"
              className="bg-background/50 border-border h-12"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-center p-4 bg-background/30 rounded-lg">
            <div>
              <div className="text-xs text-muted-foreground">Доход в день</div>
              <div className="text-xl font-bold text-green-400">₽250</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Доход в месяц</div>
              <div className="text-xl font-bold text-green-400">₽7,500</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Тарифы</h3>
        {tariffs.map((tariff, idx) => (
          <Card key={idx} className="glass border-0 p-5 space-y-3 hover-scale">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xl font-bold gradient-purple bg-clip-text text-transparent">
                  {tariff.name}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Вложено: ₽{tariff.amount.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-400">
                  +₽{tariff.daily.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">в день</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Прогресс</span>
                <span className="font-semibold">{tariff.progress}%</span>
              </div>
              <Progress value={tariff.progress} className="h-2" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="glass p-4 rounded-xl text-center">
          <div className="text-sm text-muted-foreground">Вложено</div>
          <div className="text-2xl font-bold mt-1">₽{(invested / 1000).toFixed(0)}к</div>
        </div>
        <div className="glass p-4 rounded-xl text-center">
          <div className="text-sm text-muted-foreground">Текущая прибыль</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            +₽{(currentProfit / 1000).toFixed(0)}к
          </div>
        </div>
      </div>
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-4 pb-24">
      <Card className="glass border-0 p-6 text-center space-y-4">
        <div className="text-sm text-muted-foreground">Доступно для вывода</div>
        <div className="text-5xl font-bold gradient-blue bg-clip-text text-transparent">
          ₽{balance.toLocaleString()}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => setIsDepositOpen(true)} className="gradient-blue hover:opacity-90 transition-opacity h-14 text-base font-semibold">
          <Icon name="Plus" className="mr-2" size={18} />
          Пополнить
        </Button>
        <Button className="gradient-orange hover:opacity-90 transition-opacity h-14 text-base font-semibold">
          <Icon name="ArrowUpFromLine" className="mr-2" size={18} />
          Вывести
        </Button>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Финансы</h3>
        <div className="grid grid-cols-3 gap-3">
          <Card className="glass border-0 p-4 text-center space-y-2">
            <Icon name="ArrowDownToLine" className="mx-auto text-blue-400" size={24} />
            <div className="text-xs text-muted-foreground">Пополнено</div>
            <div className="text-lg font-bold">₽125к</div>
          </Card>
          <Card className="glass border-0 p-4 text-center space-y-2">
            <Icon name="ArrowUpFromLine" className="mx-auto text-green-400" size={24} />
            <div className="text-xs text-muted-foreground">Выведено</div>
            <div className="text-lg font-bold">₽85к</div>
          </Card>
          <Card className="glass border-0 p-4 text-center space-y-2">
            <Icon name="Clock" className="mx-auto text-yellow-400" size={24} />
            <div className="text-xs text-muted-foreground">Ожидание</div>
            <div className="text-lg font-bold">₽0</div>
          </Card>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Реквизиты</h3>
        <Card className="glass border-0 p-4 flex items-center justify-between hover-scale">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center">
              <Icon name="CreditCard" size={20} />
            </div>
            <div>
              <div className="font-medium">Банковская карта</div>
              <div className="text-sm text-muted-foreground">**** 4521</div>
            </div>
          </div>
          <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
        </Card>
        <Button variant="outline" className="w-full h-12 border-dashed">
          <Icon name="Plus" className="mr-2" size={18} />
          Добавить новый метод
        </Button>
      </div>
    </div>
  );

  const renderBonus = () => (
    <div className="space-y-4 pb-24">
      <div>
        <h2 className="text-2xl font-bold">Бонусы</h2>
        <p className="text-sm text-muted-foreground mt-1">Выполняй задания — получай деньги</p>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id);
          return (
            <Card
              key={task.id}
              className="glass border-0 p-5 space-y-4 hover-scale cursor-pointer"
              onClick={() => handleTaskComplete(task.id, task.reward)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 gradient-purple rounded-full flex items-center justify-center">
                    {isCompleted ? (
                      <Icon name="Check" size={24} />
                    ) : (
                      <Icon name="Gift" size={24} />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{task.title}</div>
                    <div className="text-green-400 font-bold">+₽{task.reward}</div>
                  </div>
                </div>
              </div>
              {isCompleted ? (
                <div className="flex items-center gap-2 text-green-400 font-medium">
                  <Icon name="CheckCircle" size={18} />
                  <span>Выполнено</span>
                </div>
              ) : (
                <Button className="w-full gradient-purple hover:opacity-90 transition-opacity">
                  Выполнить
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderPartners = () => (
    <div className="space-y-4 pb-24">
      <div>
        <h2 className="text-2xl font-bold">Программа лояльности</h2>
        <p className="text-sm text-muted-foreground mt-1">Ваш доход от партнеров 25%</p>
      </div>

      <Card className="glass border-0 p-6 text-center space-y-4">
        <div className="text-sm text-muted-foreground">Доход от партнеров</div>
        <div className="text-5xl font-bold gradient-orange bg-clip-text text-transparent">
          ₽{referralIncome.toLocaleString()}
        </div>
      </Card>

      <Card className="glass border-0 p-5 space-y-4">
        <div className="text-base font-semibold">Индивидуальная ссылка</div>
        <div className="flex gap-2">
          <Input
            value="https://invest.app/ref/USER123"
            readOnly
            className="bg-background/50 border-border"
          />
          <Button className="gradient-purple hover:opacity-90 transition-opacity px-6">
            <Icon name="Copy" size={18} />
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="glass border-0 p-4 text-center space-y-2">
          <Icon name="Users" className="mx-auto text-purple-400" size={24} />
          <div className="text-xs text-muted-foreground">Приглашено</div>
          <div className="text-2xl font-bold">{totalPartners}</div>
        </Card>
        <Card className="glass border-0 p-4 text-center space-y-2">
          <Icon name="UserCheck" className="mx-auto text-green-400" size={24} />
          <div className="text-xs text-muted-foreground">Активных</div>
          <div className="text-2xl font-bold">{activePartners}</div>
        </Card>
        <Card className="glass border-0 p-4 text-center space-y-2">
          <Icon name="Coins" className="mx-auto text-yellow-400" size={24} />
          <div className="text-xs text-muted-foreground">Доход</div>
          <div className="text-xl font-bold">₽{(referralIncome / 1000).toFixed(1)}к</div>
        </Card>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="Поиск по имени"
          className="bg-background/50 border-border h-12"
          prefix={<Icon name="Search" size={18} />}
        />

        {[
          { name: 'Алексей М.', income: 3240, status: 'active' },
          { name: 'Мария К.', income: 2890, status: 'active' },
          { name: 'Иван П.', income: 0, status: 'inactive' },
        ].map((partner, idx) => (
          <Card key={idx} className="glass border-0 p-4 flex items-center justify-between hover-scale">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  partner.status === 'active' ? 'gradient-purple' : 'bg-muted'
                }`}
              >
                <Icon name="User" size={18} />
              </div>
              <div>
                <div className="font-medium">{partner.name}</div>
                <div className="text-sm text-green-400">+₽{partner.income.toLocaleString()}</div>
              </div>
            </div>
            <div
              className={`text-xs px-3 py-1 rounded-full ${
                partner.status === 'active'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {partner.status === 'active' ? 'Активен' : 'Неактивен'}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const pages = {
    home: renderHome,
    portfolio: renderPortfolio,
    wallet: renderWallet,
    bonus: renderBonus,
    partners: renderPartners,
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="max-w-md mx-auto relative">
        <div className="p-6">{pages[activePage]()}</div>

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
                  <label className="text-sm text-muted-foreground mb-2 block">Сумма пополнения</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    className="bg-background/50 border-border h-12 text-lg"
                  />
                </div>
                <Button className="w-full gradient-purple hover:opacity-90 transition-opacity h-12 text-base font-semibold">
                  Продолжить
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