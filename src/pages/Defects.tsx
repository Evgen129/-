import { useState, useEffect, useRef } from 'react';
import { API, Defect } from '../lib/db';
import { useAuth } from '../lib/auth';
import { Plus, X, Camera, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAircraftOptions } from '../lib/aircrafts';

export function Defects() {
  const { user } = useAuth();
  const { aircraftOptions } = useAircraftOptions();
  const [defects, setDefects] = useState<Defect[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form state
  const [board, setBoard] = useState('');
  const [component, setComponent] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [repairMethod, setRepairMethod] = useState('');
  const [reason, setReason] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [signature, setSignature] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDefects();
  }, []);

  const loadDefects = async () => {
    const all = await API.getAllDefects();
    if (user?.role === 'admin') setDefects(all.reverse());
    else setDefects(all.filter(d => d.mechanicName === user?.name).reverse());
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDefect: Defect = {
      number: `ДВ-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      board,
      component,
      serialNumber,
      description,
      repairMethod,
      reason,
      photo,
      mechanicName: user?.name || '',
      signature,
      status: 'открыт'
    };
    await API.addDefect(newDefect);
    setIsFormOpen(false);
    resetForm();
    loadDefects();
  };

  const resetForm = () => {
    setBoard(''); setComponent(''); setSerialNumber(''); setDescription('');
    setRepairMethod(''); setReason(''); setPhoto(''); setSignature('');
  }
  
  const generatePDF = (d: Defect) => {
    // Just a stub for the button effect
    alert(`Генерация PDF для ${d.number}...\n(Здесь могла быть логика jspdf)`);
  }

  const markClosed = async (d: Defect) => {
    await API.updateDefect({ ...d, status: 'закрыт' });
    loadDefects();
  }

  if (isFormOpen) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Новая дефектная ведомость</h2>
          <button onClick={() => setIsFormOpen(false)} className="rounded-full p-2 hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl shadow-lg border border-slate-700 bg-slate-800 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Бортовой номер</label>
              <select value={board} onChange={e => setBoard(e.target.value)} required className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500">
                <option value="">Выберите борт...</option>
                {aircraftOptions.map(aircraft => (
                  <option key={aircraft.id ?? aircraft.registration} value={aircraft.registration}>
                    {aircraft.registration} ({aircraft.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Агрегат</label>
              <input value={component} onChange={e => setComponent(e.target.value)} required className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500" placeholder="Например: Двигатель левый" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Серийный номер</label>
              <input value={serialNumber} onChange={e => setSerialNumber(e.target.value)} required className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Описание дефекта</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500 h-24" />
          </div>
          
          <div className="bg-slate-900 rounded p-4 flex flex-col items-center justify-center border border-dashed border-slate-700">
            {photo ? (
              <img src={photo} alt="Photo" className="max-h-48 rounded mb-2" />
            ) : (
              <div className="text-center text-slate-500">
                <Camera className="mx-auto mb-2 h-8 w-8" />
                <span className="text-sm">Сделать фото или выбрать</span>
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 text-sm text-blue-400 hover:text-blue-300">
              {photo ? 'Изменить фото' : 'Добавить фото'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Метод устранения</label>
            <textarea value={repairMethod} onChange={e => setRepairMethod(e.target.value)} required className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Причина дефекта</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} required className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Подпись работника (текстом)</label>
            <input value={signature} onChange={e => setSignature(e.target.value)} required className="w-full rounded bg-slate-900 p-2 border border-slate-700 focus:border-blue-500 font-mono text-sm bg-indigo-950/20" placeholder="Ваша фамилия (как подпись)" />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium p-3 rounded-lg shadow-lg flex items-center justify-center gap-2">
            <Check className="h-5 w-5" />
            Сформировать и сохранить
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Дефектные ведомости</h1>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 shadow-lg shadow-blue-900/20"
        >
          <Plus className="h-4 w-4" />
          <span>Создать</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {defects.length === 0 ? (
          <div className="col-span-full rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500">
            Нет активных дефектных ведомостей
          </div>
        ) : (
          defects.map(d => (
            <div key={d.id} className="relative rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="font-mono text-sm text-slate-300">{d.number}</span>
                <span className={cn("text-xs font-medium uppercase px-2 py-1 rounded", d.status === 'открыт' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400')}>
                  {d.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-slate-400">
                <p><strong className="text-slate-300">Борт:</strong> {d.board}</p>
                <p><strong className="text-slate-300">Агрегат:</strong> {d.component}</p>
                <p><strong className="text-slate-300">Техник:</strong> {d.mechanicName}</p>
                <p className="mt-2 line-clamp-2">{d.description}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => generatePDF(d)} className="flex-1 rounded bg-slate-700 px-2 py-1.5 text-xs font-medium hover:bg-slate-600">
                  PDF / Экспорт
                </button>
                {d.status === 'открыт' && user?.role === 'admin' && (
                  <button onClick={() => markClosed(d)} className="flex-1 rounded bg-emerald-600/20 text-emerald-400 px-2 py-1.5 text-xs font-medium hover:bg-emerald-600/30 border border-emerald-500/20">
                    Закрыть
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
