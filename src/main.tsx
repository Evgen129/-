import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { API, hashPassword, getDB } from './lib/db';

async function seedData() {
  const db = await getDB();
  const usersCount = await db.count('users');
  if (usersCount <= 1) { // only admin exists
    const pass = await hashPassword('123');
    await API.addUser({ login: 'ivanov', passwordHash: pass, name: 'Иванов Иван', position: 'Авиатехник 1 класса', role: 'user' });
    await API.addUser({ login: 'petrov', passwordHash: pass, name: 'Петров Пётр', position: 'Инженер ПДО', role: 'admin' });
    
    // Seed defects
    await API.addDefect({
      number: 'ДВ-000001',
      date: '2026-05-01',
      board: 'RA-12345',
      component: 'Приборная панель',
      serialNumber: 'SN-001',
      description: 'Не горит лампа индикации "Отказ насоса" в правом баке (по направлению полёта).',
      repairMethod: 'Замена лампы КМ-24-90',
      reason: 'Перегорание нити накала',
      mechanicName: 'Иванов Иван',
      signature: 'Иванов',
      status: 'закрыт'
    });
    
    // Seed Cards
    await API.addCard({
      number: 'КН-000001',
      type: '851',
      date: '2026-05-02',
      board: 'RA-67890',
      operations: 'Осмотр лопастей НВ, слив отстоя.',
      performers: '(Иванов Иван) Сидоров',
      controller: 'Петров Пётр',
      laborHours: 2.5,
      status: 'активно'
    });
  }
}

seedData().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});

