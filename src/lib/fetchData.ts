// Firebase Data Fetching Utilities for Milk Readings
import {
  getFirebaseData,
  listenToFirebaseData,
  type MilkReading,
  type ReadingsData,
  type ProcessedReading,
  type DashboardStats,
} from "./firebase";
import { classifyMilkQuality, type MilkData } from "./decisionTree";

/**
 * Process quality based on multiple parameters using Decision Tree
 */
function assessQuality(reading: MilkReading): "Baik" | "Sedang" | "Buruk" {
  // Map RGB string to colour value (average of RGB components)
  let colour = 255; // default white
  if (reading.rgb) {
    const rgbValues = reading.rgb.split(",").map((v) => parseInt(v.trim()));
    if (rgbValues.length === 3) {
      colour = Math.round((rgbValues[0] + rgbValues[1] + rgbValues[2]) / 3);
    }
  }

  // Prepare data for decision tree
  const milkData: MilkData = {
    ph: reading.pH,
    temperature: reading.temperature,
    // Map MQ135 to odor: lower is better (fresh)
    // MQ135 < 70 = fresh (1), 70-100 = sedang (0), > 100 = buruk (-1)
    odor: reading.mq135 < 70 ? 1 : reading.mq135 < 100 ? 0 : -1,
    // Assume taste correlates with freshness and pH
    // Fresh milk with good pH = 1, medium = 0, bad = -1
    taste:
      reading.pH >= 6.4 && reading.pH <= 6.7
        ? 1
        : reading.pH >= 6.2 && reading.pH <= 6.9
          ? 0
          : -1,
    // Use turbidity if available, otherwise default to 0 (clear)
    turbidity: 0, // Assuming clear milk, can be updated if sensor available
    colour: colour,
    // Fat content - assuming good quality if other params are good
    fat: 3.8, // Default for goat milk, can be updated if sensor available
  };

  // Use decision tree classifier
  return classifyMilkQuality(milkData);
}

/**
 * Assess freshness based on timestamp
 */
function assessFreshness(
  timestamp: number,
): "Segar" | "Cukup Segar" | "Tidak Segar" {
  const now = Date.now();
  const hoursSinceReading = (now - timestamp) / (1000 * 60 * 60);

  if (hoursSinceReading < 2) {
    return "Segar";
  } else if (hoursSinceReading < 6) {
    return "Cukup Segar";
  } else {
    return "Tidak Segar";
  }
}

/**
 * Process raw reading into ProcessedReading
 */
function processReading(id: string, reading: MilkReading): ProcessedReading {
  return {
    ...reading,
    id,
    dateTime: new Date(reading.timestamp),
    quality: assessQuality(reading),
    freshness: assessFreshness(reading.timestamp),
  };
}

/**
 * Fetch all milk readings from Firebase
 */
export async function fetchReadings(): Promise<ProcessedReading[]> {
  try {
    // Skip on server-side rendering
    if (typeof window === "undefined") {
      return [];
    }

    const data = await getFirebaseData<ReadingsData>("readings");

    if (!data) {
      console.log("No readings found in Firebase");
      return [];
    }

    // Convert object to array and process
    const readings = Object.entries(data).map(([id, reading]) =>
      processReading(id, reading),
    );

    console.log(`Fetched ${readings.length} readings from Firebase`);

    // Sort by timestamp (newest first)
    return readings.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  } catch (error) {
    console.error("Error fetching readings:", error);
    return [];
  }
}

/**
 * Fetch latest reading
 */
export async function fetchLatestReading(): Promise<ProcessedReading | null> {
  try {
    const readings = await fetchReadings();
    return readings.length > 0 ? readings[0] : null;
  } catch (error) {
    console.error("Error fetching latest reading:", error);
    return null;
  }
}

/**
 * Fetch readings within a date range
 */
export async function fetchReadingsByDateRange(
  startDate: Date,
  endDate: Date,
): Promise<ProcessedReading[]> {
  try {
    const allReadings = await fetchReadings();

    return allReadings.filter(
      (reading) => reading.dateTime >= startDate && reading.dateTime <= endDate,
    );
  } catch (error) {
    console.error("Error fetching readings by date range:", error);
    return [];
  }
}

/**
 * Fetch dashboard statistics
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const readings = await fetchReadings();

    console.log(`Processing stats for ${readings.length} readings`);

    if (readings.length === 0) {
      console.log("No readings available for stats");
      return {
        totalReadings: 0,
        avgPH: 0,
        avgMQ135: 0,
        goodQuality: 0,
        mediumQuality: 0,
        poorQuality: 0,
      };
    }

    const totalReadings = readings.length;
    const avgPH = readings.reduce((sum, r) => sum + r.pH, 0) / totalReadings;
    const avgMQ135 =
      readings.reduce((sum, r) => sum + r.mq135, 0) / totalReadings;

    const goodQuality = readings.filter((r) => r.quality === "Baik").length;
    const mediumQuality = readings.filter((r) => r.quality === "Sedang").length;
    const poorQuality = readings.filter((r) => r.quality === "Buruk").length;

    console.log(
      `Stats: Good=${goodQuality}, Medium=${mediumQuality}, Poor=${poorQuality}`,
    );

    const stats = {
      totalReadings,
      avgPH: Math.round(avgPH * 100) / 100,
      avgMQ135: Math.round(avgMQ135),
      goodQuality,
      mediumQuality,
      poorQuality,
      latestReading: readings[0],
    };

    return stats;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalReadings: 0,
      avgPH: 0,
      avgMQ135: 0,
      goodQuality: 0,
      mediumQuality: 0,
      poorQuality: 0,
    };
  }
}

/**
 * Fetch pH data for the last N readings (for charts)
 */
export async function fetchPHChart(
  limit: number = 10,
): Promise<{ labels: string[]; data: number[] }> {
  try {
    const readings = await fetchReadings();

    console.log(
      `Fetching pH chart for ${readings.length} readings, limit: ${limit}`,
    );

    if (readings.length === 0) {
      return { labels: [], data: [] };
    }

    const limitedReadings = readings.slice(0, limit).reverse(); // Get latest N and reverse for chronological order

    const labels = limitedReadings.map((r) =>
      r.dateTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    const data = limitedReadings.map((r) => r.pH);

    console.log(
      `pH Chart: ${labels.length} labels, ${data.length} data points`,
    );

    return { labels, data };
  } catch (error) {
    console.error("Error fetching pH chart data:", error);
    return {
      labels: [],
      data: [],
    };
  }
}

/**
 * Fetch MQ135 data for the last N readings (for charts)
 */
export async function fetchMQ135Chart(
  limit: number = 10,
): Promise<{ labels: string[]; data: number[] }> {
  try {
    const readings = await fetchReadings();

    console.log(
      `Fetching MQ135 chart for ${readings.length} readings, limit: ${limit}`,
    );

    if (readings.length === 0) {
      return { labels: [], data: [] };
    }

    const limitedReadings = readings.slice(0, limit).reverse();

    const labels = limitedReadings.map((r) =>
      r.dateTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    const data = limitedReadings.map((r) => r.mq135);

    console.log(
      `MQ135 Chart: ${labels.length} labels, ${data.length} data points`,
    );

    return { labels, data };
  } catch (error) {
    console.error("Error fetching MQ135 chart data:", error);
    return {
      labels: [],
      data: [],
    };
  }
}

/**
 * Fetch quality distribution data (for pie/doughnut chart)
 */
export async function fetchQualityDistribution(): Promise<{
  labels: string[];
  data: number[];
}> {
  try {
    const stats = await fetchDashboardStats();

    console.log(
      `Quality Distribution: Good=${stats.goodQuality}, Medium=${stats.mediumQuality}, Poor=${stats.poorQuality}`,
    );

    return {
      labels: ["Kualitas Baik", "Kualitas Sedang", "Kualitas Buruk"],
      data: [stats.goodQuality, stats.mediumQuality, stats.poorQuality],
    };
  } catch (error) {
    console.error("Error fetching quality distribution:", error);
    return {
      labels: ["Kualitas Baik", "Kualitas Sedang", "Kualitas Buruk"],
      data: [0, 0, 0],
    };
  }
}

/**
 * Fetch combined pH and MQ135 data for multi-line chart
 */
export async function fetchCombinedChart(limit: number = 15): Promise<{
  labels: string[];
  pH: number[];
  mq135: number[];
}> {
  try {
    const readings = await fetchReadings();

    console.log(
      `Fetching combined chart for ${readings.length} readings, limit: ${limit}`,
    );

    if (readings.length === 0) {
      return { labels: [], pH: [], mq135: [] };
    }

    const limitedReadings = readings.slice(0, limit).reverse();

    const labels = limitedReadings.map((r) =>
      r.dateTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    const pH = limitedReadings.map((r) => r.pH);
    const mq135 = limitedReadings.map((r) => r.mq135);

    console.log(`Combined Chart: ${labels.length} labels`);

    return { labels, pH, mq135 };
  } catch (error) {
    console.error("Error fetching combined chart data:", error);
    return {
      labels: [],
      pH: [],
      mq135: [],
    };
  }
}

/**
 * Fetch hourly average data for the last 24 hours
 */
export async function fetchHourlyAverages(): Promise<{
  labels: string[];
  avgPH: number[];
  avgMQ135: number[];
}> {
  try {
    const readings = await fetchReadings();
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Filter readings from last 24 hours
    const recentReadings = readings.filter((r) => r.dateTime >= last24Hours);

    // Group by hour
    const hourlyData: {
      [hour: string]: { pH: number[]; mq135: number[] };
    } = {};

    recentReadings.forEach((reading) => {
      const hour = reading.dateTime.getHours();
      const hourKey = `${hour.toString().padStart(2, "0")}:00`;

      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = { pH: [], mq135: [] };
      }

      hourlyData[hourKey].pH.push(reading.pH);
      hourlyData[hourKey].mq135.push(reading.mq135);
    });

    // Calculate averages
    const labels: string[] = [];
    const avgPH: number[] = [];
    const avgMQ135: number[] = [];

    Object.keys(hourlyData)
      .sort()
      .forEach((hour) => {
        const data = hourlyData[hour];
        labels.push(hour);
        avgPH.push(
          Math.round(
            (data.pH.reduce((a, b) => a + b, 0) / data.pH.length) * 100,
          ) / 100,
        );
        avgMQ135.push(
          Math.round(data.mq135.reduce((a, b) => a + b, 0) / data.mq135.length),
        );
      });

    return { labels, avgPH, avgMQ135 };
  } catch (error) {
    console.error("Error fetching hourly averages:", error);
    return {
      labels: [],
      avgPH: [],
      avgMQ135: [],
    };
  }
}

/**
 * Fetch color distribution (for visualization)
 */
export async function fetchColorDistribution(): Promise<{
  [color: string]: number;
}> {
  try {
    const readings = await fetchReadings();
    const colorCount: { [color: string]: number } = {};

    readings.forEach((reading) => {
      const color = reading.color;
      colorCount[color] = (colorCount[color] || 0) + 1;
    });

    return colorCount;
  } catch (error) {
    console.error("Error fetching color distribution:", error);
    return {};
  }
}

/**
 * Listen to real-time updates for readings
 */
export function listenToReadings(
  callback: (readings: ProcessedReading[]) => void,
): (() => void) | null {
  return listenToFirebaseData<ReadingsData>("readings", (data) => {
    if (data) {
      const readings = Object.entries(data)
        .map(([id, reading]) => processReading(id, reading))
        .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

      callback(readings);
    } else {
      callback([]);
    }
  });
}

/**
 * Listen to real-time updates for dashboard stats
 */
export function listenToDashboardStats(
  callback: (stats: DashboardStats) => void,
): (() => void) | null {
  return listenToReadings((readings) => {
    if (readings.length === 0) {
      callback({
        totalReadings: 0,
        avgPH: 0,
        avgMQ135: 0,
        goodQuality: 0,
        mediumQuality: 0,
        poorQuality: 0,
      });
      return;
    }

    const totalReadings = readings.length;
    const avgPH = readings.reduce((sum, r) => sum + r.pH, 0) / totalReadings;
    const avgMQ135 =
      readings.reduce((sum, r) => sum + r.mq135, 0) / totalReadings;

    const goodQuality = readings.filter((r) => r.quality === "Baik").length;
    const mediumQuality = readings.filter((r) => r.quality === "Sedang").length;
    const poorQuality = readings.filter((r) => r.quality === "Buruk").length;

    callback({
      totalReadings,
      avgPH: Math.round(avgPH * 100) / 100,
      avgMQ135: Math.round(avgMQ135),
      goodQuality,
      mediumQuality,
      poorQuality,
      latestReading: readings[0],
    });
  });
}

/**
 * Listen to latest reading only
 */
export function listenToLatestReading(
  callback: (reading: ProcessedReading | null) => void,
): (() => void) | null {
  return listenToReadings((readings) => {
    callback(readings.length > 0 ? readings[0] : null);
  });
}
