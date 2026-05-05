import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { API, FuelLog } from '../lib/db';
import { AircraftSelect } from '../lib/aircrafts';
import { Plus, X, Camera } from 'lucide-react';

export function Fuel() {
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form
  const [board, setBoard] = useState('');
  const [fuelType, setFuelType] = useState('Т-1 / ТС-1');
  const [passportNumber, setPassportNumber] = useState('');
  const [checkClean, setCheckClean] = useState(false);
  const [checkWater, setCheckWater] = useState(false);
  const [checkImpurities, setCheckImpurities] = useState(false);
  const [photo, setPhoto] = useState('');

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    setLogs((await API.getAllFuels()).reverse());
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await API.addFuel({
      date: new Date().toISOString().split('T')[0],
      board, fuelType, passportNumber, checkClean, checkWater, checkImpurities, photo
    });
    setIsFormOpen(false);
    loadLogs();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Контроль ГСМ</h1>
        <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500">
          <Plus className="h-4 w-4" /> Контроль
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Аэродромный контроль</h3>
            <button type="button" onClick={() => setIsFormOpen(false)}><X className="h-5 w-5"/></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <AircraftSelect value={board} onChange={setBoard} required className="rounded bg-slate-900 p-2 text-sm border border-slate-700"/>
             <input placeholder="Марка топлива" value={fuelType} onChange={e=>setFuelType(e.target.value)} required className="rounded bg-slate-900 p-2 text-sm border border-slate-700"/>
          </div>
          <input placeholder="№ Паспорта" value={passportNumber} onChange={e=>setPassportNumber(e.target.value)} required className="w-full rounded bg-slate-900 p-2 text-sm border border-slate-700"/>
          
          <div className="space-y-2 bg-slate-900 p-3 rounded border border-slate-700">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={checkClean} onChange={e=>setCheckClean(e.target.checked)} className="rounded border-slate-600 bg-slate-800"/>
              Чистота (Слив отстоя)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={checkWater} onChange={e=>setCheckWater(e.target.checked)} className="rounded border-slate-600 bg-slate-800"/>
              Отсутствие воды
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={checkImpurities} onChange={e=>setCheckImpurities(e.target.checked)} className="rounded border-slate-600 bg-slate-800"/>
              Отсутствие мех. примесей
            </label>
          </div>

          <div className="bg-slate-900 rounded p-4 flex flex-col items-center border border-dashed border-slate-700">
            {photo ? <img src={photo} alt="Doc" className="max-h-32 rounded mb-2" /> : <Camera className="mb-2 h-6 w-6 text-slate-500" />}
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-400">Фото паспорта ГСМ</button>
          </div>

          <button type="submit" className="w-full bg-blue-600 rounded p-2 text-white font-medium hover:bg-blue-500">Сохранить</button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {logs.map(lg => (
          <div key={lg.id} className="rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between border-b border-slate-700 pb-2 text-sm text-slate-400">
              <span>{lg.date} | Борт: {lg.board}</span>
              <span className="font-mono text-xs">{lg.passportNumber}</span>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <span className={lg.checkClean ? "text-emerald-400" : "text-red-400"}>Чистота</span>
              <span className={lg.checkWater ? "text-emerald-400" : "text-red-400"}>Без воды</span>
              <span className={lg.checkImpurities ? "text-emerald-400" : "text-red-400"}>Без примесей</span>
            </div>
            {lg.photo && (
              <img src={lg.photo} alt="Passport" className="mt-2 h-24 w-full object-cover rounded opacity-80" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
