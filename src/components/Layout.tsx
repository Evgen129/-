import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { 
  BatteryCharging,
  ClipboardList, 
  FileCheck, 
  BookOpen, 
  Cable,
  Droplet, 
  Flame,
  Lightbulb, 
  FileText, 
  Users2, 
  BarChart3,
  LogOut,
  Plane,
  PlugZap,
  Rocket,
  Settings,
  Snowflake,
  Wrench,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout() {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const navItems = [
    { to: '/defects', icon: ClipboardList, label: 'Дефекты' },
    { to: '/cards', icon: FileCheck, label: 'Наряды' },
    { to: '/logbook', icon: BookOpen, label: 'Бортжурнал' },
    { to: '/fuel', icon: Droplet, label: 'ГСМ' },
    { to: '/aircrafts', icon: Plane, label: 'ВС' },
    { to: '/knowledge/vk2500', icon: Lightbulb, label: 'ВК-2500' },
    { to: '/knowledge/tv3', icon: Wrench, label: 'ТВ3-117' },
    { to: '/knowledge/apu', icon: Zap, label: 'ВСУ' },
    { to: '/knowledge/generators', icon: PlugZap, label: 'Генер.' },
    { to: '/knowledge/ac-power', icon: Cable, label: '~115В' },
    { to: '/knowledge/dc-power', icon: BatteryCharging, label: '27В' },
    { to: '/knowledge/anti-ice', icon: Snowflake, label: 'ПОС' },
    { to: '/knowledge/fire', icon: Flame, label: 'Пожар' },
    { to: '/knowledge/start', icon: Rocket, label: 'Запуск' },
    { to: '/knowledge/lighting', icon: Lightbulb, label: 'Подсвет' },
    { to: '/solutions', icon: FileText, label: 'Решения' },
    { to: '/settings', icon: Settings, label: 'Настр.' },
    ...(isAdmin ? [
      { to: '/docs', icon: FileText, label: 'База' },
      { to: '/reports', icon: BarChart3, label: 'Отчёты' },
      { to: '/users', icon: Users2, label: 'Люди' },
    ] : [])
  ];

  return (
    <div className="flex h-screen w-full flex-col bg-slate-900 text-slate-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-amber-500 text-xs font-black text-slate-950">
            MI-8
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Авиатехник Ми-8</span>
            <span className="text-xs text-slate-400">ТВ3-117ВМ</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <span className="block text-sm font-semibold">{user.name}</span>
            <span className="block text-xs text-slate-400">{user.position}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded p-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto bg-slate-950 p-4 pb-24 sm:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 rounded-lg bg-blue-900/20 p-3 text-xs text-blue-200 border border-blue-900/50">
            <strong>ГЛОБАЛЬНОЕ ПРАВИЛО:</strong> Вся ориентация в схемах и описаниях — «ПО НАПРАВЛЕНИЮ ПОЛЁТА»
          </div>
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-1 overflow-x-auto border-t border-slate-800 bg-slate-900 px-2 pb-safe pt-1 sm:static sm:h-auto sm:justify-start sm:gap-4 sm:border-t-0 sm:px-6 sm:py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              "flex min-w-16 shrink-0 flex-col items-center rounded-lg p-2 text-xs font-medium transition-colors sm:min-w-0 sm:flex-row sm:gap-2 sm:text-sm",
              isActive ? "text-blue-500" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <Icon className="mb-1 h-5 w-5 sm:mb-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
