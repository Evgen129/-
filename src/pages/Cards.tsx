import { useState, useEffect } from 'react';
import { API, WorkCard } from '../lib/db';
import { useAuth } from '../lib/auth';
import { Plus, X, Ban } from 'lucide-react';
import { useAircraftOptions } from '../lib/aircrafts';

export function Cards() {
  const { user } = useAuth();
  const [cards, setCards] = useState<WorkCard[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { aircraftOptions } = useAircraftOptions();

  // Form State
  const [type, setType] = useState<'851' | '853'>('851');
  const [board, setBoard] = useState('');
  const [operations, setOperations] = useState('');
  const [performers, setPerformers] = useState('');
  const [controller, setController] = useState('');
  const [laborHours, setLaborHours] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const all = await API.getAllCards();
    if (user?.role === 'admin') setCards(all.reverse());
    else setCards(all.filter(c => c.performers.includes(user?.name || '')).reverse());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: WorkCard = {
      number: `КН-${Date.now().toString().slice(-6)}`,
      type,
      date: new Date().toISOString().split('T')[0],
      board,
      operations,
      performers: `(${user?.name}) ${performers}`,
      controller,
      laborHours: parseFloat(laborHours),
      status: 'активно'
    };
    await API.addCard(newCard);
    setIsFormOpen(false);
    resetForm();
    loadCards();
  };

  const resetForm = () => {
    setType('851'); setBoard(''); setOperations('');
    setPerformers(''); setController(''); setLaborHours('');
  };

  const annulCard = async (c: WorkCard) => {
    await API.updateCard({ ...c, status: 'аннулировано' });
    loadCards();
  };

  if (isFormOpen) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Новая карта-наряд</h2>
          <button onClick={() => setIsFormOpen(false)} className="rounded-full p-2 hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Тип карты</label>
              <select value={type} onChange={e => setType(e.target.value as '851' | '853')} className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500">
                <option value="851">851 (Оперативное)</option>
                <option value="853">853 (Бюллетени/Дефекты)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Бортовой номер</label>
              <select value={board} onChange={e => setBoard(e.target.value)} required className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500">
                <option value="">Выбрать...</option>
                {aircraftOptions.map(aircraft => (
                  <option key={aircraft.id ?? aircraft.registration} value={aircraft.registration}>
                    {aircraft.registration} ({aircraft.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Выполненные операции</label>
            <textarea value={operations} onChange={e => setOperations(e.target.value)} required className="h-20 w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500" placeholder="Перечень работ" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Контролирующее лицо</label>
              <input value={controller} onChange={e => setController(e.target.value)} required className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Трудоёмкость (чел-час)</label>
              <input type="number" step="0.1" value={laborHours} onChange={e => setLaborHours(e.target.value)} required className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500" />
            </div>
          </div>
          
          <button type="submit" className="w-full rounded-lg bg-blue-600 p-3 font-medium text-white hover:bg-blue-500">
            Сохранить карту-наряд
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Карты-наряды</h1>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium shadow-lg hover:bg-blue-500 shadow-blue-900/20"
        >
          <Plus className="h-4 w-4" />
          <span>Создать</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.length === 0 ? (
          <div className="col-span-full rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500">
            Нет активных карт-нарядов
          </div>
        ) : (
          cards.map(c => (
            <div key={c.id} className="rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm relative overflow-hidden">
              {c.status === 'аннулировано' && (
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center p-2 opacity-20 pointer-events-none">
                  <div className="rotate-[-20deg] border-4 border-red-500 text-6xl font-bold text-red-500 whitespace-nowrap">АННУЛИРОВАНО</div>
                </div>
              )}
              <div className="mb-2 flex items-center justify-between border-b border-slate-700 pb-2 relative z-10">
                <span className="font-mono text-sm font-semibold">{c.number} (Тип: {c.type})</span>
                <span className="text-xs text-slate-400">{c.date}</span>
              </div>
              <div className="space-y-1 text-sm text-slate-400 relative z-10">
                <p><strong className="text-slate-300">Борт:</strong> {c.board}</p>
                <p><strong className="text-slate-300">Исполнители:</strong> {c.performers}</p>
                <p><strong className="text-slate-300">Контролёр:</strong> {c.controller}</p>
                <div className="mt-2 text-xs bg-slate-900 p-2 rounded border border-slate-700">
                  <span className="text-blue-400 font-medium">Операции:</span><br/> {c.operations}
                </div>
              </div>
              {c.status === 'активно' && user?.role === 'admin' && (
                <div className="mt-4 flex justify-end relative z-10">
                  <button onClick={() => annulCard(c)} className="flex items-center gap-1 rounded bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20">
                    <Ban className="h-3 w-3" /> Аннулировать
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
