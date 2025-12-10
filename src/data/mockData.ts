// src/data/mockData.ts

export interface Room {
  id: string;
  name: string;
  status: 'available' | 'occupied';
  needsAiring: boolean;
  temperature: number;
  humidity: number;
  co2: number;
  brightness: number;
  noise: number;
  moduleId: string;
}

export interface Module {
  id: string;
  name: string;
  roomId: string;
  status: 'online' | 'offline';
  lastSync: string;
  batteryLevel: number;
  acquisitionInterval: number;
  firmwareVersion: string;
}

export interface Alert {
  id: string;
  roomName: string;
  type: 'co2' | 'temperature' | 'noise';
  message: string;
  timestamp: string;
}

export const mockRooms: Room[] = [
  // Étage 1
  {
    id: 'room-1-1',
    name: 'Salle 1.1',
    status: 'available',
    needsAiring: false,
    temperature: 21.5,
    humidity: 45,
    co2: 650,
    brightness: 320,
    noise: 35,
    moduleId: 'module-1-1'
  },
  {
    id: 'room-1-2',
    name: 'Salle 1.2',
    status: 'occupied',
    needsAiring: false,
    temperature: 23.2,
    humidity: 52,
    co2: 890,
    brightness: 450,
    noise: 58,
    moduleId: 'module-1-2'
  },
  {
    id: 'room-1-3',
    name: 'Salle 1.3',
    status: 'available',
    needsAiring: false,
    temperature: 20.8,
    humidity: 43,
    co2: 620,
    brightness: 290,
    noise: 32,
    moduleId: 'module-1-3'
  },
  // Étage 2
  {
    id: 'room-2-1',
    name: 'Salle 2.1',
    status: 'occupied',
    needsAiring: false,
    temperature: 22.5,
    humidity: 48,
    co2: 780,
    brightness: 410,
    noise: 52,
    moduleId: 'module-2-1'
  },
  {
    id: 'room-2-2',
    name: 'Salle 2.2',
    status: 'available',
    needsAiring: false,
    temperature: 21.2,
    humidity: 46,
    co2: 680,
    brightness: 340,
    noise: 36,
    moduleId: 'module-2-2'
  },
  {
    id: 'room-2-3',
    name: 'Salle 2.3',
    status: 'occupied',
    needsAiring: false,
    temperature: 23.8,
    humidity: 54,
    co2: 920,
    brightness: 470,
    noise: 62,
    moduleId: 'module-2-3'
  },
  {
    id: 'room-2-4',
    name: 'Salle 2.4',
    status: 'available',
    needsAiring: false,
    temperature: 21.0,
    humidity: 44,
    co2: 640,
    brightness: 310,
    noise: 34,
    moduleId: 'module-2-4'
  },
  // Étage 3
  {
    id: 'room-3-1',
    name: 'Salle 3.1',
    status: 'available',
    needsAiring: false,
    temperature: 20.5,
    humidity: 42,
    co2: 600,
    brightness: 280,
    noise: 30,
    moduleId: 'module-3-1'
  },
  {
    id: 'room-3-2',
    name: 'Salle 3.2',
    status: 'available',
    needsAiring: true,
    temperature: 24.5,
    humidity: 60,
    co2: 1350,
    brightness: 420,
    noise: 55,
    moduleId: 'module-3-2'
  },
  {
    id: 'room-3-3',
    name: 'Salle 3.3',
    status: 'occupied',
    needsAiring: false,
    temperature: 22.8,
    humidity: 50,
    co2: 850,
    brightness: 440,
    noise: 56,
    moduleId: 'module-3-3'
  },
  {
    id: 'room-3-4',
    name: 'Salle 3.4',
    status: 'available',
    needsAiring: false,
    temperature: 21.3,
    humidity: 47,
    co2: 670,
    brightness: 330,
    noise: 37,
    moduleId: 'module-3-4'
  },
  // Étage 4
  {
    id: 'room-4-1',
    name: 'Salle 4.1',
    status: 'occupied',
    needsAiring: false,
    temperature: 23.0,
    humidity: 51,
    co2: 820,
    brightness: 430,
    noise: 54,
    moduleId: 'module-4-1'
  },
  {
    id: 'room-4-2',
    name: 'Salle 4.2',
    status: 'available',
    needsAiring: false,
    temperature: 20.9,
    humidity: 45,
    co2: 630,
    brightness: 300,
    noise: 33,
    moduleId: 'module-4-2'
  },
  {
    id: 'room-4-3',
    name: 'Salle 4.3',
    status: 'available',
    needsAiring: false,
    temperature: 21.6,
    humidity: 46,
    co2: 660,
    brightness: 350,
    noise: 38,
    moduleId: 'module-4-3'
  },
  {
    id: 'room-4-4',
    name: 'Salle 4.4',
    status: 'occupied',
    needsAiring: true,
    temperature: 24.8,
    humidity: 62,
    co2: 1420,
    brightness: 460,
    noise: 51,
    moduleId: 'module-4-4'
  }
];

export const mockModules: Module[] = [
  {
    id: 'module-1-1',
    name: 'IoT-1.1-01',
    roomId: 'room-1-1',
    status: 'online',
    lastSync: '2025-12-10T10:45:32',
    batteryLevel: 87,
    acquisitionInterval: 30,
    firmwareVersion: '2.3.1'
  },
  {
    id: 'module-1-2',
    name: 'IoT-1.2-01',
    roomId: 'room-1-2',
    status: 'online',
    lastSync: '2025-12-10T10:44:58',
    batteryLevel: 92,
    acquisitionInterval: 30,
    firmwareVersion: '2.3.1'
  },
  {
    id: 'module-1-3',
    name: 'IoT-1.3-01',
    roomId: 'room-1-3',
    status: 'online',
    lastSync: '2025-12-10T10:45:15',
    batteryLevel: 78,
    acquisitionInterval: 60,
    firmwareVersion: '2.2.8'
  },
  {
    id: 'module-2-1',
    name: 'IoT-2.1-01',
    roomId: 'room-2-1',
    status: 'online',
    lastSync: '2025-12-10T10:45:28',
    batteryLevel: 95,
    acquisitionInterval: 30,
    firmwareVersion: '2.3.1'
  },
  {
    id: 'module-2-2',
    name: 'IoT-2.2-01',
    roomId: 'room-2-2',
    status: 'online',
    lastSync: '2025-12-10T10:45:10',
    batteryLevel: 68,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  },
  {
    id: 'module-2-3',
    name: 'IoT-2.3-01',
    roomId: 'room-2-3',
    status: 'online',
    lastSync: '2025-12-10T10:45:10',
    batteryLevel: 68,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  },
  {
    id: 'module-2-4',
    name: 'IoT-2.4-01',
    roomId: 'room-2-4',
    status: 'online',
    lastSync: '2025-12-10T10:45:10',
    batteryLevel: 68,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  },
  {
    id: 'module-3-1',
    name: 'IoT-3.1-01',
    roomId: 'room-3-1',
    status: 'online',
    lastSync: '2025-12-10T10:45:10',
    batteryLevel: 68,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  },
  {
    id: 'module-3-2',
    name: 'IoT-3.2-01',
    roomId: 'room-3-2',
    status: 'online',
    lastSync: '2025-12-10T10:45:10',
    batteryLevel: 68,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  },
  {
    id: 'module-3-3',
    name: 'IoT-3.3-01',
    roomId: 'room-3-3',
    status: 'online',
    lastSync: '2025-12-10T10:45:10',
    batteryLevel: 68,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  },
  {
    id: 'module-3-4',
    name: 'IoT-3.4-01',
    roomId: 'room-3-4',
    status: 'offline',
    lastSync: '2025-12-10T08:23:18',
    batteryLevel: 12,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  },
  {
    id: 'module-4-1',
    name: 'IoT-4.1-01',
    roomId: 'room-4-1',
    status: 'online',
    lastSync: '2025-12-10T10:45:10',
    batteryLevel: 68,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  },
  {
    id: 'module-4-2',
    name: 'IoT-4.2-01',
    roomId: 'room-4-2',
    status: 'online',
    lastSync: '2025-12-10T10:45:10',
    batteryLevel: 68,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  },
  {
    id: 'module-4-3',
    name: 'IoT-4.3-01',
    roomId: 'room-4-3',
    status: 'online',
    lastSync: '2025-12-10T10:45:10',
    batteryLevel: 68,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  },
  {
    id: 'module-4-4',
    name: 'IoT-4.4-01',
    roomId: 'room-4-4',
    status: 'online',
    lastSync: '2025-12-10T10:45:10',
    batteryLevel: 68,
    acquisitionInterval: 60,
    firmwareVersion: '2.3.0'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    roomName: 'Salle 1.4',
    type: 'co2',
    message: 'Niveau de CO₂ élevé (1200 ppm)',
    timestamp: '2025-12-10T10:42:15'
  },
  {
    id: 'alert-2',
    roomName: 'Salle 1.2',
    type: 'noise',
    message: 'Niveau sonore élevé (58 dB)',
    timestamp: '2025-12-10T10:38:42'
  },
  {
    id: 'alert-3',
    roomName: 'Salle 1.3',
    type: 'temperature',
    message: 'Module hors ligne depuis 1h30',
    timestamp: '2025-12-10T09:15:00'
  }
];

export const generateHistoricalData = (current: number, points: number = 20) => {
  const data = [];
  for (let i = points; i >= 0; i--) {
    const variation = (Math.random() - 0.5) * (current * 0.15);
    data.push({
      time: `${10 - Math.floor(i / 6)}:${(60 - (i % 6) * 10).toString().padStart(2, '0')}`,
      value: Math.max(0, current + variation)
    });
  }
  return data;
};