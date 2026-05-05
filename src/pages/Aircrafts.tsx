import { useEffect, useState } from 'react';
import { API, Aircraft } from '../lib/db';
import { useAuth } from '../lib/auth';
import { Plane, Plus, Trash2 } from 'lucide-react';

export function Aircrafts() {
  const { user } = useAuth();
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [registration, setRegistration] = useState('');
  const [type, setType] = useState('Ми-8');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadAircrafts();
  }, []);

  const loadAircrafts = async () => {
    setAircrafts((await API.getAllAircrafts()).sort((a, b) => a.registration.localeCompare(b.registration)));
  };

  const addAircraft = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextRegistration = registration.trim().toUpperCase();
    const nextType = type.trim() || 'Ми-8';

    if (!nextRegistration) return;

    await API.addAircraft({ registration: nextRegistration, type: nextType });
    setRegistration('');
    setType('Ми-8');
    loadAircrafts();
  };

  const deleteAircraft = async (id?: number) => {
    if (!id || !confirm('Удалить борт?')) return;
    await API.deleteAircraft(id);
    loadAircrafts();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Воздушные суда</h1>
          <p className="mt-1 text-sm text-slate-500">Справочник бортов для ведомостей, нарядов и журналов.</p>
        </div>
        <Plane className="h-8 w-8 text-blue-400" />
      </div>

      {isAdmin && (
        <form onSubmit={addAircraft} className="mb-6 rounded-xl border border-slate-700 bg-slate-800 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Plus className="h-4 w-4 text-blue-400" />
            Добавить борт
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              value={registration}
              onChange={event => setRegistration(event.target.value)}
              placeholder="RA-XXXXX"
              className="rounded bg-slate-900 p-2 text-sm uppercase text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-blue-500 focus:outline-none"
              required
            />
            <input
              value={type}
              onChange={event => setType(event.target.value)}
              placeholder="Тип ВС"
              className="rounded bg-slate-900 p-2 text-sm text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-blue-500 focus:outline-none"
            />
            <button className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
              Добавить
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700 text-sm">
            <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">N</th>
                <th className="px-4 py-3">Регистрация</th>
                <th className="px-4 py-3">Тип</th>
                {isAdmin && <th className="px-4 py-3 text-right">Действие</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {aircrafts.map((aircraft, index) => (
                <tr key={aircraft.id ?? aircraft.registration}>
                  <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-200">{aircraft.registration}</td>
                  <td className="px-4 py-3 text-slate-300">{aircraft.type}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteAircraft(aircraft.id)}
                        className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3 w-3" />
                        Удалить
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {aircrafts.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} className="px-4 py-8 text-center text-slate-500">
                    Борта не заведены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
