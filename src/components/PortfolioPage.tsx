import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface PortfolioPageProps {
  portfolioTotal: number;
  dailyIncome: number;
  tariffs: Array<{ name: string; amount: number; daily: number; progress: number }>;
  invested: number;
  currentProfit: number;
}

export const PortfolioPage = ({
  portfolioTotal,
  dailyIncome,
  tariffs,
  invested,
  currentProfit,
}: PortfolioPageProps) => {
  return (
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
};
