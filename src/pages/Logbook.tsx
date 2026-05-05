import { useState, useEffect } from 'react';
import { API, LogbookEntry } from '../lib/db';
import { useAuth } from '../lib/auth';
import { Plus, X } from 'lucide-react';
import { useAircraftOptions } from '../lib/aircrafts';

export function Logbook() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogbookEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { aircrafts, defaultBoard } = useAircraftOptions();

  // Form
  const [board, setBoard] = useState('');
  const [captain, setCaptain] = useState('');
  const [description, setDescription] = useState('');
  const [actions, setActions] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    if (!board && defaultBoard) {
      setBoard(defaultBoard);
    }
  }, [board, defaultBoard]);

  const loadLogs = async () => {
    const all = await API.getAllLogbooks();
    setLogs(all.reverse());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.addLogbook({
      date: new Date().toISOString().split('T')[0],
      board,
      captain,
      description,
      actions,
      fixedBy: user?.name || ''
    });
    setIsFormOpen(false);
    loadLogs();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Бортовой журнал</h1>
        {user?.role === 'admin' && (
          <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500">
            <Plus className="h-4 w-4" /> Добавить запись
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Новая запись</h3>
            <button type="button" onClick={() => setIsFormOpen(false)}><X className="h-5 w-5"/></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <select value={board} onChange={e=>setBoard(e.target.value)} required className="rounded bg-slate-900 p-2 text-sm border border-slate-700">
              <option value="">Выбрать борт...</option>
              {aircrafts.map(aircraft => (
                <option key={aircraft.id ?? aircraft.registration} value={aircraft.registration}>
                  {aircraft.registration} ({aircraft.type})
                </option>
              ))}
             </select>
             <input placeholder="Командир" value={captain} onChange={e=>setCaptain(e.target.value)} required className="rounded bg-slate-900 p-2 text-sm border border-slate-700"/>
          </div>
          <textarea placeholder="Неисправность в полёте" value={description} onChange={e=>setDescription(e.target.value)} required className="w-full h-16 rounded bg-slate-900 p-2 text-sm border border-slate-700"/>
          <textarea placeholder="Меры/Устранение" value={actions} onChange={e=>setActions(e.target.value)} required className="w-full h-16 rounded bg-slate-900 p-2 text-sm border border-slate-700"/>
          <button type="submit" className="w-full bg-blue-600 rounded p-2 text-white font-medium hover:bg-blue-500">Сохранить</button>
        </form>
      )}

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500">
            Записей нет
          </div>
        ) : (
          logs.map(lg => (
            <div key={lg.id} className="rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm flex flex-col gap-2">
              <div className="flex justify-between border-b border-slate-700 pb-2 text-sm text-slate-400">
                <span>{lg.date} | Борт: {lg.board}</span>
                <span>КВС: {lg.captain}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-400">Дефект: {lg.description}</p>
                <p className="text-sm text-emerald-400 mt-1">Устранение: {lg.actions}</p>
              </div>
              <div className="text-right text-xs text-slate-500 mt-2">
                Устранил: {lg.fixedBy}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
