// Script to add sample data to Firebase Realtime Database with current timestamps
import https from "https";

const FIREBASE_URL =
  "https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app";

// Generate current timestamp
const now = Date.now();

// Sample data - 20 readings with current timestamps (last 3 hours)
const sampleData = {
  "-Reading001": {
    color: "Putih",
    mq135: 45,
    pH: 6.5,
    rgb: "255,255,255",
    timestamp: now - 180 * 60 * 1000, // 3 hours ago
  },
  "-Reading002": {
    color: "Putih Kekuningan",
    mq135: 65,
    pH: 6.6,
    rgb: "255,245,238",
    timestamp: now - 170 * 60 * 1000, // 2h 50m ago
  },
  "-Reading003": {
    color: "Putih",
    mq135: 55,
    pH: 6.4,
    rgb: "255,250,245",
    timestamp: now - 160 * 60 * 1000, // 2h 40m ago
  },
  "-Reading004": {
    color: "Kekuningan",
    mq135: 75,
    pH: 6.7,
    rgb: "255,240,220",
    timestamp: now - 150 * 60 * 1000, // 2h 30m ago
  },
  "-Reading005": {
    color: "Putih",
    mq135: 50,
    pH: 6.5,
    rgb: "255,255,250",
    timestamp: now - 140 * 60 * 1000, // 2h 20m ago
  },
  "-Reading006": {
    color: "Putih Kekuningan",
    mq135: 60,
    pH: 6.6,
    rgb: "255,248,240",
    timestamp: now - 130 * 60 * 1000, // 2h 10m ago
  },
  "-Reading007": {
    color: "Putih",
    mq135: 48,
    pH: 6.5,
    rgb: "255,255,255",
    timestamp: now - 120 * 60 * 1000, // 2h ago
  },
  "-Reading008": {
    color: "Kekuningan",
    mq135: 85,
    pH: 6.8,
    rgb: "255,235,210",
    timestamp: now - 110 * 60 * 1000, // 1h 50m ago
  },
  "-Reading009": {
    color: "Putih",
    mq135: 52,
    pH: 6.4,
    rgb: "255,252,248",
    timestamp: now - 100 * 60 * 1000, // 1h 40m ago
  },
  "-Reading010": {
    color: "Putih Kekuningan",
    mq135: 58,
    pH: 6.6,
    rgb: "255,245,235",
    timestamp: now - 90 * 60 * 1000, // 1h 30m ago
  },
  "-Reading011": {
    color: "Putih",
    mq135: 47,
    pH: 6.5,
    rgb: "255,255,255",
    timestamp: now - 80 * 60 * 1000, // 1h 20m ago
  },
  "-Reading012": {
    color: "Putih Kekuningan",
    mq135: 63,
    pH: 6.6,
    rgb: "255,246,239",
    timestamp: now - 70 * 60 * 1000, // 1h 10m ago
  },
  "-Reading013": {
    color: "Putih",
    mq135: 51,
    pH: 6.4,
    rgb: "255,253,249",
    timestamp: now - 60 * 60 * 1000, // 1h ago
  },
  "-Reading014": {
    color: "Kekuningan",
    mq135: 78,
    pH: 6.7,
    rgb: "255,238,215",
    timestamp: now - 50 * 60 * 1000, // 50m ago
  },
  "-Reading015": {
    color: "Putih",
    mq135: 49,
    pH: 6.5,
    rgb: "255,255,252",
    timestamp: now - 40 * 60 * 1000, // 40m ago
  },
  "-Reading016": {
    color: "Putih Kekuningan",
    mq135: 62,
    pH: 6.6,
    rgb: "255,247,240",
    timestamp: now - 30 * 60 * 1000, // 30m ago
  },
  "-Reading017": {
    color: "Putih",
    mq135: 46,
    pH: 6.5,
    rgb: "255,255,255",
    timestamp: now - 20 * 60 * 1000, // 20m ago
  },
  "-Reading018": {
    color: "Putih Kekuningan",
    mq135: 67,
    pH: 6.6,
    rgb: "255,244,237",
    timestamp: now - 10 * 60 * 1000, // 10m ago
  },
  "-Reading019": {
    color: "Putih",
    mq135: 53,
    pH: 6.4,
    rgb: "255,251,247",
    timestamp: now - 5 * 60 * 1000, // 5m ago
  },
  "-Reading020": {
    color: "Putih Kekuningan",
    mq135: 59,
    pH: 6.6,
    rgb: "255,246,238",
    timestamp: now, // Right now!
  },
};

console.log("🚀 Starting Firebase data upload...");
console.log(`📊 Preparing to add ${Object.keys(sampleData).length} readings`);
console.log(`⏰ Current time: ${new Date(now).toLocaleString("id-ID")}`);
console.log(`📅 Time range: Last 3 hours\n`);

// Function to send data to Firebase
function addDataToFirebase() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(sampleData);

    const options = {
      hostname:
        "goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app",
      path: "/readings.json",
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
          console.log("✅ Success! Data has been added to Firebase");
          console.log(`📍 URL: ${FIREBASE_URL}/readings`);
          console.log("\n📊 Summary:");
          console.log(`   - Total readings: ${Object.keys(sampleData).length}`);

          // Calculate stats
          const readings = Object.values(sampleData);
          const avgPH =
            readings.reduce((sum, r) => sum + r.pH, 0) / readings.length;
          const avgMQ135 =
            readings.reduce((sum, r) => sum + r.mq135, 0) / readings.length;

          console.log(`   - Average pH: ${avgPH.toFixed(2)}`);
          console.log(`   - Average MQ135: ${Math.round(avgMQ135)}`);
          console.log(`   - Time range: Last 3 hours (real-time)`);
          console.log(
            `   - Latest reading: ${new Date(now).toLocaleString("id-ID")}`,
          );

          console.log("\n🎉 All done! Your dashboard will show:");
          console.log("   ✓ Latest reading as SEGAR (fresh)");
          console.log("   ✓ All timestamps are current");
          console.log("   ✓ Data from the last 3 hours");
          console.log("\n💡 Refresh your dashboard to see the new data!\n");

          resolve(responseData);
        } else {
          reject(new Error(`Failed with status code: ${res.statusCode}`));
        }
      });
    });

    req.on("error", (error) => {
      console.error("❌ Error:", error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Execute
addDataToFirebase()
  .then(() => {
    console.log("✨ Process completed successfully!\n");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Failed to add data:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Check your internet connection");
    console.error("   2. Verify Firebase project is active");
    console.error("   3. Check Firebase Security Rules allow write access");
    console.error("   4. Try adding data manually via Firebase Console\n");
    process.exit(1);
  });
