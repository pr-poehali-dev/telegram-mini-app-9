import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HomePageProps {
  balance: number;
  profit24h: number;
  partnersCount: number;
  withdrawn: number;
  operations: Array<{ type: string; amount: number; date: string }>;
  onDepositClick: () => void;
}

export const HomePage = ({
  balance,
  profit24h,
  partnersCount,
  withdrawn,
  operations,
  onDepositClick,
}: HomePageProps) => {
  return (
    <div className="space-y-4 pb-24">
      <Card className="glass border-0 p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">Баланс</div>
          <div className="text-5xl font-bold gradient-purple text-transparent bg-slate-300">0</div>
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

      <Button
        onClick={onDepositClick}
        className="w-full gradient-purple hover:opacity-90 transition-opacity h-14 text-lg font-semibold"
      >
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
};