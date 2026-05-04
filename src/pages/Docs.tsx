import { FileText, Book } from 'lucide-react';

export function Docs() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Нормативная база</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <Book className="mb-2 h-6 w-6 text-blue-400" />
          <h3 className="font-semibold text-slate-200">ФАП-285</h3>
          <p className="text-sm text-slate-400 mt-1">Сертификационные требования к организациям ТО.</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <FileText className="mb-2 h-6 w-6 text-orange-400" />
          <h3 className="font-semibold text-slate-200">Регламент ТО Ми-8Т</h3>
          <p className="text-sm text-slate-400 mt-1">ОСТ 1 00357-92. Угол установки — 4°30′ вверх и вправо (по направлению полёта).</p>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-8 text-center">
        <p className="text-sm text-slate-500">Заглушка с готовой архитектурой для будущего наполнения (pdf, epub, html).</p>
      </div>
    </>
  );
}
