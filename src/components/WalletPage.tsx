import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface WalletPageProps {
  balance: number;
  onDepositClick: () => void;
}

export const WalletPage = ({ balance, onDepositClick }: WalletPageProps) => {
  return (
    <div className="space-y-4 pb-24">
      <Card className="glass border-0 p-6 text-center space-y-4">
        <div className="text-sm text-muted-foreground">Доступно для вывода</div>
        <div className="text-5xl font-bold gradient-blue bg-clip-text text-transparent">
          ₽{balance.toLocaleString()}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onDepositClick}
          className="gradient-blue hover:opacity-90 transition-opacity h-14 text-base font-semibold"
        >
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
};
