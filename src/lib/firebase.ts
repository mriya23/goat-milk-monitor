// Firebase Configuration and Initialization
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  get,
  type Database,
} from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKTn5zBzy0w5iaiedXq150vK5eESW4dJc",
  authDomain: "goat-milk-monitor.firebaseapp.com",
  databaseURL:
    "https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "goat-milk-monitor",
  storageBucket: "goat-milk-monitor.appspot.com",
  messagingSenderId: "782450512071",
  appId: "1:782450512071:web:02f757a206ac3cc3d6aee2",
  measurementId: "G-VYWBXL2GY0",
};

// Initialize Firebase
let app: FirebaseApp;
let database: Database;

// Initialize only on client side
if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
}

// Export database instance
export { database };

// Helper function to get data from Firebase
export async function getFirebaseData<T>(path: string): Promise<T | null> {
  try {
    if (typeof window === "undefined") {
      return null; // Return null on server side
    }

    const dbRef = ref(database, path);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      return snapshot.val() as T;
    } else {
      console.log(`No data available at path: ${path}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    return null;
  }
}

// Helper function to listen to real-time updates
export function listenToFirebaseData<T>(
  path: string,
  callback: (data: T | null) => void,
): (() => void) | null {
  try {
    if (typeof window === "undefined") {
      return null; // Return null on server side
    }

    const dbRef = ref(database, path);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val() as T);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error("Error listening to Firebase:", error);
        callback(null);
      },
    );

    // Return unsubscribe function
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up Firebase listener:", error);
    return null;
  }
}

// Type definitions for our data structure (Firebase Realtime Database)
export interface MilkReading {
  id?: string;
  color: string;
  mq135: number;
  pH: number;
  rgb: string;
  timestamp: number;
  temperature: number;
}

export interface ReadingsData {
  [key: string]: MilkReading;
}

export interface ProcessedReading extends MilkReading {
  id: string;
  dateTime: Date;
  quality: "Baik" | "Sedang" | "Buruk";
  freshness: "Segar" | "Cukup Segar" | "Tidak Segar";
}

export interface DashboardStats {
  totalReadings: number;
  avgPH: number;
  avgMQ135: number;
  goodQuality: number;
  mediumQuality: number;
  poorQuality: number;
  latestReading?: ProcessedReading;
}

// Legacy types (for backward compatibility)
export interface GoatData {
  id: string;
  name: string;
  status: "laktasi" | "hamil" | "muda" | "jantan" | "kering";
  dailyProduction?: number;
  lastMilked?: string;
  birthDate?: string;
  health?: "baik" | "perhatian" | "sakit";
}

export interface ProductionData {
  date: string;
  amount: number;
  quality?: {
    protein?: number;
    fat?: number;
    lactose?: number;
  };
  session: "pagi" | "siang" | "sore";
}

export interface ActivityLog {
  id: string;
  type: "pemerahan" | "kelahiran" | "vaksinasi" | "kesehatan" | "pakan";
  description: string;
  timestamp: string;
  icon?: string;
}
