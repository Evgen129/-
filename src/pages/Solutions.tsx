import { Lightbulb } from 'lucide-react';

export function Solutions() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Полевые решения</h1>
      </div>
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-12 text-center flex flex-col items-center">
        <Lightbulb className="h-12 w-12 text-slate-500 mb-4" />
        <h2 className="text-lg font-medium text-slate-300">Здесь будут проверенные полевые решения</h2>
        <p className="mt-2 text-sm text-slate-500 max-w-sm">
           База знаний для нестандартных ситуаций. В структуре заложены флаги isUnofficial и weatherConditions.
        </p>
      </div>
    </>
  );
}
