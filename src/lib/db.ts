import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface User {
  id?: number;
  login: string;
  passwordHash: string;
  name: string;
  position: string;
  role: 'admin' | 'user';
}

export interface Defect {
  id?: number;
  number: string;
  date: string;
  board: string;
  component: string;
  serialNumber: string;
  description: string;
  photo?: string;
  repairMethod: string;
  reason: string;
  mechanicName: string;
  signature: string;
  status: 'открыт' | 'закрыт';
}

export interface WorkCard {
  id?: number;
  number: string;
  type: '851' | '853';
  date: string;
  board: string;
  operations: string;
  performers: string;
  controller: string;
  laborHours: number;
  status: 'активно' | 'аннулировано';
  defectId?: number;
}

export interface LogbookEntry {
  id?: number;
  date: string;
  board: string;
  captain: string;
  description: string;
  actions: string;
  fixedBy: string;
}

export interface FuelLog {
  id?: number;
  date: string;
  board: string;
  fuelType: string;
  checkClean: boolean;
  checkWater: boolean;
  checkImpurities: boolean;
  passportNumber: string;
  photo?: string;
}

export interface Aircraft {
  id?: number;
  registration: string;
  type: string;
}

interface AviaDB extends DBSchema {
  users: {
    key: number;
    value: User;
    indexes: { 'by-login': string };
  };
  defects: {
    key: number;
    value: Defect;
  };
  cards: {
    key: number;
    value: WorkCard;
  };
  logbooks: {
    key: number;
    value: LogbookEntry;
  };
  fuels: {
    key: number;
    value: FuelLog;
  };
  aircrafts: {
    key: number;
    value: Aircraft;
  };
}

export async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

let dbPromise: Promise<IDBPDatabase<AviaDB>>;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<AviaDB>('AviationDB', 2, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('by-login', 'login', { unique: true });
        }
        if (!db.objectStoreNames.contains('defects')) {
          db.createObjectStore('defects', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('cards')) {
          db.createObjectStore('cards', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('logbooks')) {
          db.createObjectStore('logbooks', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('fuels')) {
          db.createObjectStore('fuels', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('aircrafts')) {
          db.createObjectStore('aircrafts', { keyPath: 'id', autoIncrement: true });
        }
      },
    }).then(async (db) => {
      // Seed default admin
      const adminExists = await db.getFromIndex('users', 'by-login', 'admin');
      if (!adminExists) {
        const passwordHash = await hashPassword('admin');
        await db.add('users', {
          login: 'admin',
          passwordHash,
          name: 'Администратор системы',
          position: 'Администратор',
          role: 'admin',
        });
      }
      const aircrafts = await db.getAll('aircrafts');
      if (aircrafts.length === 0) {
        await Promise.all([
          db.add('aircrafts', { registration: 'RA-06191', type: 'Ми-8МТВ-1' }),
          db.add('aircrafts', { registration: 'RA-22345', type: 'Ми-8АМТШ' }),
          db.add('aircrafts', { registration: 'RA-67890', type: 'Ми-8МТ' }),
        ]);
      }
      return db;
    });
  }
  return dbPromise;
}

export const API = {
  // Users
  addUser: async (user: User) => (await getDB()).add('users', user),
  updateUser: async (user: User) => (await getDB()).put('users', user),
  deleteUser: async (id: number) => (await getDB()).delete('users', id),
  getUserByLogin: async (login: string) => (await getDB()).getFromIndex('users', 'by-login', login),
  getAllUsers: async () => (await getDB()).getAll('users'),

  // Defects
  addDefect: async (defect: Defect) => (await getDB()).add('defects', defect),
  updateDefect: async (defect: Defect) => (await getDB()).put('defects', defect),
  getAllDefects: async () => (await getDB()).getAll('defects'),
  getDefect: async (id: number) => (await getDB()).get('defects', id),

  // Work Cards
  addCard: async (card: WorkCard) => (await getDB()).add('cards', card),
  updateCard: async (card: WorkCard) => (await getDB()).put('cards', card),
  getAllCards: async () => (await getDB()).getAll('cards'),
  getCard: async (id: number) => (await getDB()).get('cards', id),

  // Logbook
  addLogbook: async (log: LogbookEntry) => (await getDB()).add('logbooks', log),
  getAllLogbooks: async () => (await getDB()).getAll('logbooks'),

  // Fuels
  addFuel: async (fuel: FuelLog) => (await getDB()).add('fuels', fuel),
  getAllFuels: async () => (await getDB()).getAll('fuels'),

  // Aircrafts
  addAircraft: async (aircraft: Aircraft) => (await getDB()).add('aircrafts', aircraft),
  updateAircraft: async (aircraft: Aircraft) => (await getDB()).put('aircrafts', aircraft),
  deleteAircraft: async (id: number) => (await getDB()).delete('aircrafts', id),
  getAllAircrafts: async () => (await getDB()).getAll('aircrafts'),
};
