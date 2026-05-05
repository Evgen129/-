import { MouseEvent, useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!promptInstall) return;
    promptInstall.prompt();
  };

  if (!supportsPWA) return null;

  return (
    <button
      className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 font-medium text-white shadow-xl hover:bg-blue-500 sm:bottom-4"
      onClick={onClick}
    >
      <Download className="h-5 w-5" />
      Установить приложение
    </button>
  );
}
