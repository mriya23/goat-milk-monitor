// Script to save daily statistics to Firebase for comparison tracking
import https from "https";

const FIREBASE_URL =
  "https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app";

console.log("📊 Calculating and saving daily statistics...\n");

// Fetch current readings from Firebase
async function fetchReadings() {
  return new Promise((resolve, reject) => {
    https
      .get(`${FIREBASE_URL}/readings.json`, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Assess quality
function assessQuality(pH, mq135) {
  const pHInRange = pH >= 6.4 && pH <= 6.7;
  const goodAirQuality = mq135 < 70;

  if (pHInRange && goodAirQuality) return "Baik";
  else if (pH >= 6.2 && pH <= 6.9 && mq135 < 100) return "Sedang";
  else return "Buruk";
}

// Process readings
function processReadings(data) {
  if (!data) return [];

  const readings = Object.entries(data).map(([id, reading]) => ({
    id,
    ...reading,
    quality: assessQuality(reading.pH, reading.mq135),
  }));

  return readings;
}

// Calculate statistics
function calculateStats(readings) {
  if (readings.length === 0) {
    return null;
  }

  const totalReadings = readings.length;
  const avgPH = readings.reduce((sum, r) => sum + r.pH, 0) / totalReadings;
  const avgMQ135 =
    readings.reduce((sum, r) => sum + r.mq135, 0) / totalReadings;

  const goodQuality = readings.filter((r) => r.quality === "Baik").length;
  const mediumQuality = readings.filter((r) => r.quality === "Sedang").length;
  const poorQuality = readings.filter((r) => r.quality === "Buruk").length;

  // Find min and max values
  const pHValues = readings.map((r) => r.pH);
  const mq135Values = readings.map((r) => r.mq135);

  const minPH = Math.min(...pHValues);
  const maxPH = Math.max(...pHValues);
  const minMQ135 = Math.min(...mq135Values);
  const maxMQ135 = Math.max(...mq135Values);

  return {
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
    timestamp: Date.now(),
    totalReadings,
    avgPH: Math.round(avgPH * 100) / 100,
    avgMQ135: Math.round(avgMQ135),
    minPH: Math.round(minPH * 100) / 100,
    maxPH: Math.round(maxPH * 100) / 100,
    minMQ135: Math.round(minMQ135),
    maxMQ135: Math.round(maxMQ135),
    goodQuality,
    mediumQuality,
    poorQuality,
    goodQualityPercentage: Math.round((goodQuality / totalReadings) * 100),
    mediumQualityPercentage: Math.round((mediumQuality / totalReadings) * 100),
    poorQualityPercentage: Math.round((poorQuality / totalReadings) * 100),
  };
}

// Save statistics to Firebase
function saveStats(stats) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(stats);
    const dateKey = stats.date.replace(/-/g, "_"); // Replace dashes with underscores for Firebase key

    const options = {
      hostname:
        "goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app",
      path: `/statistics/daily/${dateKey}.json`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(responseData);
        } else {
          reject(
            new Error(`Failed with status code: ${res.statusCode}`),
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Main execution
async function main() {
  try {
    console.log("📡 Fetching current readings from Firebase...");
    const data = await fetchReadings();

    if (!data) {
      console.error("❌ No data found in Firebase");
      process.exit(1);
    }

    console.log(`✅ Found ${Object.keys(data).length} readings\n`);

    console.log("🔄 Processing readings and calculating statistics...");
    const readings = processReadings(data);
    const stats = calculateStats(readings);

    if (!stats) {
      console.error("❌ Failed to calculate statistics");
      process.exit(1);
    }

    console.log("✅ Statistics calculated\n");

    console.log("📊 Daily Statistics:");
    console.log(`   📅 Date: ${stats.date}`);
    console.log(`   📈 Total Readings: ${stats.totalReadings}`);
    console.log(`   🔵 Average pH: ${stats.avgPH} (Range: ${stats.minPH} - ${stats.maxPH})`);
    console.log(`   🟢 Average MQ135: ${stats.avgMQ135} (Range: ${stats.minMQ135} - ${stats.maxMQ135})`);
    console.log(`   ✅ Good Quality: ${stats.goodQuality} (${stats.goodQualityPercentage}%)`);
    console.log(`   ⚠️  Medium Quality: ${stats.mediumQuality} (${stats.mediumQualityPercentage}%)`);
    console.log(`   ❌ Poor Quality: ${stats.poorQuality} (${stats.poorQualityPercentage}%)\n`);

    console.log("💾 Saving statistics to Firebase...");
    await saveStats(stats);

    console.log("✅ Statistics saved successfully!\n");
    console.log("📍 Location: /statistics/daily/" + stats.date.replace(/-/g, "_"));
    console.log("🔗 URL: " + FIREBASE_URL + "/statistics/daily.json\n");

    console.log("🎉 Done! You can now:");
    console.log("   ✓ Compare daily statistics");
    console.log("   ✓ Track quality trends over time");
    console.log("   ✓ Analyze pH and MQ135 patterns");
    console.log("   ✓ View statistics in Firebase Console\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Check your internet connection");
    console.error("   2. Verify Firebase URL is correct");
    console.error("   3. Make sure readings exist in Firebase");
    console.error("   4. Check Firebase security rules\n");
    process.exit(1);
  }
}

// Run the script
main();
