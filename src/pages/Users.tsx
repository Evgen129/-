import { useState, useEffect } from 'react';
import { API, User } from '../lib/db';
import { useAuth } from '../lib/auth';
import { ShieldCheck, UserX } from 'lucide-react';

export function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setUsers(await API.getAllUsers());
  };

  const setAdmin = async (targetUser: User) => {
    await API.updateUser({ ...targetUser, role: 'admin' });
    loadUsers();
  };

  const removeUser = async (targetId: number) => {
    if (confirm('Удалить пользователя?')) {
      await API.deleteUser(targetId);
      loadUsers();
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Сотрудники</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map(u => (
          <div key={u.id} className="rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{u.name}</span>
                {u.role === 'admin' ? (
                  <span className="text-xs font-semibold text-orange-400 bg-orange-950/30 px-2 py-1 rounded">Админ</span>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-2 py-1 rounded">Пользователь</span>
                )}
              </div>
              <div className="text-sm text-slate-400 mt-1">{u.position}</div>
              <div className="text-xs text-slate-500 mt-1 font-mono">Логин: {u.login}</div>
            </div>
            
            {u.id !== user?.id && (
              <div className="mt-4 flex gap-2 border-t border-slate-700 pt-3">
                {u.role !== 'admin' && (
                  <button onClick={() => setAdmin(u)} className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300">
                    <ShieldCheck className="h-4 w-4" /> Назначить админом
                  </button>
                )}
                <button onClick={() => removeUser(u.id!)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 ml-auto">
                  <UserX className="h-4 w-4" /> Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
