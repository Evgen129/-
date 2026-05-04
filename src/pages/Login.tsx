import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { API, hashPassword } from '../lib/db';
import { PlaneTakeoff } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const dbUser = await API.getUserByLogin(loginInput);

      if (isRegister) {
        if (dbUser) {
          setError('Пользователь с таким логином уже существует');
          return;
        }
        const passwordHash = await hashPassword(password);
        const newUser = {
          login: loginInput,
          passwordHash,
          name,
          position,
          role: 'user' as const,
        };
        await API.addUser(newUser);
        login(newUser);
      } else {
        if (!dbUser) {
          setError('Пользователь не найден');
          return;
        }
        const passwordHash = await hashPassword(password);
        if (dbUser.passwordHash !== passwordHash) {
          setError('Неверный пароль');
          return;
        }
        login(dbUser);
      }
    } catch (err) {
      setError('Ошибка при входе');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-900 px-4 text-slate-100">
      <div className="w-full max-w-sm rounded-xl bg-slate-800 p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center">
          <PlaneTakeoff className="h-12 w-12 text-blue-500 mb-2" />
          <h1 className="text-2xl font-bold tracking-tight text-center">
            Авиатехник:<br/>Дефектовка и ТО
          </h1>
        </div>

        {error && <div className="mb-4 text-sm text-red-500 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-400">Логин</label>
            <input
              type="text"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="w-full rounded-lg bg-slate-700 p-2.5 text-slate-100 placeholder-slate-400 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-400">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-700 p-2.5 text-slate-100 placeholder-slate-400 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">ФИО</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 p-2.5 text-slate-100 placeholder-slate-400 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-400">Должность</label>
                <input
                  type="text"
                  placeholder="Например: Инженер ПДО"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full rounded-lg bg-slate-700 p-2.5 text-slate-100 placeholder-slate-400 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-2.5 font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {isRegister ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            {isRegister ? 'Войти' : 'Создать'}
          </button>
        </p>
      </div>
    </div>
  );
}
