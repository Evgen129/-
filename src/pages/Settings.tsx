import { useEffect, useState } from 'react';

export function Settings() {
  const [gloveMode, setGloveMode] = useState(() => localStorage.getItem('gloveMode') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('glove-mode', gloveMode);
    localStorage.setItem('gloveMode', String(gloveMode));
  }, [gloveMode]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Настройки</h1>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <label className="flex items-center justify-between gap-4">
          <span>
            <span className="block font-semibold text-slate-100">Режим "Перчатки"</span>
            <span className="mt-1 block text-sm text-slate-400">
              Увеличивает кнопки и поля ввода для работы на планшете в полевых условиях.
            </span>
          </span>
          <input
            type="checkbox"
            checked={gloveMode}
            onChange={event => setGloveMode(event.target.checked)}
            className="h-6 w-6 rounded border-slate-600 bg-slate-900"
          />
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800 p-4 text-sm text-slate-400">
        <p>
          Версия 9.0 - Ми-8 / ТВ3-117ВМ. Данные хранятся локально в IndexedDB и доступны без сети после установки PWA.
        </p>
      </div>
    </>
  );
}
