import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface BonusPageProps {
  tasks: Array<{ id: string; title: string; reward: number }>;
  completedTasks: string[];
  onTaskComplete: (taskId: string, reward: number) => void;
}

export const BonusPage = ({ tasks, completedTasks, onTaskComplete }: BonusPageProps) => {
  return (
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
              onClick={() => onTaskComplete(task.id, task.reward)}
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
};

interface PartnersPageProps {
  referralIncome: number;
  totalPartners: number;
  activePartners: number;
  referralCode: string;
  referrals: Array<{ name: string; joined_at: string; is_active: boolean }>;
  webApp: any;
}

export const PartnersPage = ({
  referralIncome,
  totalPartners,
  activePartners,
  referralCode,
  referrals,
  webApp,
}: PartnersPageProps) => {
  const referralUrl = referralCode 
    ? `https://t.me/YOUR_BOT_USERNAME?start=${referralCode}`
    : 'https://invest.app/ref/USER123';
  
  const handleShare = () => {
    if (webApp) {
      const shareText = `🚀 Присоединяйся к инвестиционной платформе!\n\n💰 Получи бонус при регистрации\n📈 Доход до 25% годовых\n\n👉 ${referralUrl}`;
      webApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(shareText)}`);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
  };
  return (
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
            value={referralUrl}
            readOnly
            className="bg-background/50 border-border"
          />
          <Button 
            onClick={handleCopy}
            className="gradient-purple hover:opacity-90 transition-opacity px-6"
          >
            <Icon name="Copy" size={18} />
          </Button>
        </div>
        <Button 
          onClick={handleShare}
          className="w-full gradient-blue hover:opacity-90 transition-opacity"
        >
          <Icon name="Share2" className="mr-2" size={18} />
          Поделиться в Telegram
        </Button>
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

        {referrals.length > 0 ? (
          referrals.map((partner, idx) => (
            <Card key={idx} className="glass border-0 p-4 flex items-center justify-between hover-scale">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    partner.is_active ? 'gradient-purple' : 'bg-muted'
                  }`}
                >
                  <Icon name="User" size={18} />
                </div>
                <div>
                  <div className="font-medium">{partner.name}</div>
                  <div className="text-xs text-muted-foreground">{partner.joined_at}</div>
                </div>
              </div>
              <div
                className={`text-xs px-3 py-1 rounded-full ${
                  partner.is_active
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {partner.is_active ? 'Активен' : 'Неактивен'}
              </div>
            </Card>
          ))
        ) : (
          <Card className="glass border-0 p-8 text-center">
            <Icon name="Users" className="mx-auto text-muted-foreground mb-4" size={48} />
            <div className="text-lg font-semibold mb-2">Пока нет рефералов</div>
            <div className="text-sm text-muted-foreground">
              Поделитесь своей ссылкой, чтобы пригласить друзей
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};