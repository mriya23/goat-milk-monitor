/**
 * Script untuk menambahkan sample data dengan variasi kualitas ke Firebase
 *
 * Cara menjalankan:
 * node add-quality-data.js
 */

const FIREBASE_URL = 'https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app';

// Fungsi helper untuk generate timestamp
function getTimestamp(minutesAgo = 0) {
    return Date.now() - (minutesAgo * 60 * 1000);
}

// Fungsi helper untuk generate random value dalam range
function randomInRange(min, max, decimals = 0) {
    const value = Math.random() * (max - min) + min;
    return decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.round(value);
}

// Data sample dengan berbagai kualitas
const sampleData = {
    // ========== KUALITAS BAIK (10 data) ==========
    'Reading001': {
        color: 'Putih',
        mq135: 45,
        pH: 6.6,
        rgb: '255,255,255',
        temperature: 6,
        timestamp: getTimestamp(120) // 2 jam yang lalu
    },
    'Reading002': {
        color: 'Putih',
        mq135: 50,
        pH: 6.7,
        rgb: '254,254,254',
        temperature: 5,
        timestamp: getTimestamp(110)
    },
    'Reading003': {
        color: 'Putih',
        mq135: 48,
        pH: 6.5,
        rgb: '255,253,255',
        temperature: 7,
        timestamp: getTimestamp(100)
    },
    'Reading004': {
        color: 'Putih',
        mq135: 52,
        pH: 6.6,
        rgb: '253,255,254',
        temperature: 6,
        timestamp: getTimestamp(90)
    },
    'Reading005': {
        color: 'Putih',
        mq135: 47,
        pH: 6.8,
        rgb: '255,255,253',
        temperature: 5,
        timestamp: getTimestamp(80)
    },
    'Reading006': {
        color: 'Putih',
        mq135: 55,
        pH: 6.5,
        rgb: '254,255,255',
        temperature: 7,
        timestamp: getTimestamp(70)
    },
    'Reading007': {
        color: 'Putih',
        mq135: 49,
        pH: 6.7,
        rgb: '255,254,254',
        temperature: 6,
        timestamp: getTimestamp(60)
    },
    'Reading008': {
        color: 'Putih',
        mq135: 51,
        pH: 6.6,
        rgb: '253,254,255',
        temperature: 5,
        timestamp: getTimestamp(50)
    },
    'Reading009': {
        color: 'Putih',
        mq135: 46,
        pH: 6.8,
        rgb: '255,255,252',
        temperature: 7,
        timestamp: getTimestamp(40)
    },
    'Reading010': {
        color: 'Putih',
        mq135: 53,
        pH: 6.5,
        rgb: '254,253,255',
        temperature: 6,
        timestamp: getTimestamp(30)
    },

    // ========== KUALITAS SEDANG (7 data) ==========
    'Reading011': {
        color: 'Putih Kekuningan',
        mq135: 75,
        pH: 6.3,
        rgb: '248,245,240',
        temperature: 10,
        timestamp: getTimestamp(25)
    },
    'Reading012': {
        color: 'Putih Kekuningan',
        mq135: 82,
        pH: 6.4,
        rgb: '245,242,238',
        temperature: 9,
        timestamp: getTimestamp(22)
    },
    'Reading013': {
        color: 'Putih Kekuningan',
        mq135: 78,
        pH: 6.2,
        rgb: '246,244,241',
        temperature: 11,
        timestamp: getTimestamp(20)
    },
    'Reading014': {
        color: 'Putih Kekuningan',
        mq135: 85,
        pH: 6.9,
        rgb: '243,240,235',
        temperature: 12,
        timestamp: getTimestamp(18)
    },
    'Reading015': {
        color: 'Putih Kekuningan',
        mq135: 80,
        pH: 6.3,
        rgb: '247,243,239',
        temperature: 10,
        timestamp: getTimestamp(15)
    },
    'Reading016': {
        color: 'Putih Kekuningan',
        mq135: 88,
        pH: 6.8,
        rgb: '244,241,237',
        temperature: 13,
        timestamp: getTimestamp(12)
    },
    'Reading017': {
        color: 'Putih Kekuningan',
        mq135: 76,
        pH: 6.4,
        rgb: '246,242,240',
        temperature: 11,
        timestamp: getTimestamp(10)
    },

    // ========== KUALITAS BURUK (8 data) ==========
    'Reading018': {
        color: 'Kekuningan',
        mq135: 105,
        pH: 5.8,
        rgb: '235,225,210',
        temperature: 16,
        timestamp: getTimestamp(8)
    },
    'Reading019': {
        color: 'Kekuningan',
        mq135: 112,
        pH: 5.9,
        rgb: '230,220,205',
        temperature: 17,
        timestamp: getTimestamp(7)
    },
    'Reading020': {
        color: 'Kekuningan',
        mq135: 108,
        pH: 7.3,
        rgb: '232,222,208',
        temperature: 18,
        timestamp: getTimestamp(6)
    },
    'Reading021': {
        color: 'Kekuningan',
        mq135: 115,
        pH: 5.7,
        rgb: '228,218,203',
        temperature: 19,
        timestamp: getTimestamp(5)
    },
    'Reading022': {
        color: 'Kekuningan',
        mq135: 110,
        pH: 7.4,
        rgb: '233,223,207',
        temperature: 16,
        timestamp: getTimestamp(4)
    },
    'Reading023': {
        color: 'Kekuningan',
        mq135: 118,
        pH: 5.6,
        rgb: '225,215,200',
        temperature: 20,
        timestamp: getTimestamp(3)
    },
    'Reading024': {
        color: 'Kekuningan',
        mq135: 107,
        pH: 7.5,
        rgb: '234,224,209',
        temperature: 17,
        timestamp: getTimestamp(2)
    },
    'Reading025': {
        color: 'Kekuningan',
        mq135: 120,
        pH: 5.5,
        rgb: '220,210,195',
        temperature: 21,
        timestamp: getTimestamp(1)
    }
};

// Fungsi untuk upload data ke Firebase
async function uploadData() {
    console.log('🚀 Memulai upload data ke Firebase...\n');

    let successCount = 0;
    let failCount = 0;

    // Upload setiap reading
    for (const [key, data] of Object.entries(sampleData)) {
        try {
            const response = await fetch(`${FIREBASE_URL}/readings/${key}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Tentukan kualitas berdasarkan parameter
                let quality = 'Unknown';
                if (data.pH >= 6.5 && data.pH <= 6.8 && data.mq135 < 70 && data.temperature >= 4 && data.temperature <= 8) {
                    quality = '🟢 Baik';
                } else if (data.pH < 6.0 || data.pH > 7.2 || data.mq135 > 100 || data.temperature > 15) {
                    quality = '🔴 Buruk';
                } else {
                    quality = '🟡 Sedang';
                }

                console.log(`✅ ${key}: ${quality} (pH: ${data.pH}, MQ135: ${data.mq135}, Temp: ${data.temperature}°C)`);
                successCount++;
            } else {
                console.log(`❌ ${key}: Gagal upload`);
                failCount++;
            }

            // Delay kecil untuk menghindari rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.log(`❌ ${key}: Error - ${error.message}`);
            failCount++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RINGKASAN UPLOAD');
    console.log('='.repeat(60));
    console.log(`Total data: ${Object.keys(sampleData).length}`);
    console.log(`✅ Berhasil: ${successCount}`);
    console.log(`❌ Gagal: ${failCount}`);
    console.log('='.repeat(60));

    console.log('\n📈 DISTRIBUSI KUALITAS:');
    console.log('🟢 Baik: 10 data (Reading001-Reading010)');
    console.log('🟡 Sedang: 7 data (Reading011-Reading017)');
    console.log('🔴 Buruk: 8 data (Reading018-Reading025)');

    console.log('\n🎯 KRITERIA KUALITAS:');
    console.log('🟢 Baik:');
    console.log('   • pH: 6.5-6.8');
    console.log('   • MQ135: 45-55 (< 70)');
    console.log('   • Temperature: 5-7°C (4-8°C)');
    console.log('   • Warna: Putih bersih');

    console.log('\n🟡 Sedang:');
    console.log('   • pH: 6.2-6.9');
    console.log('   • MQ135: 75-88 (70-100)');
    console.log('   • Temperature: 9-13°C (8-15°C)');
    console.log('   • Warna: Putih kekuningan');

    console.log('\n🔴 Buruk:');
    console.log('   • pH: 5.5-5.9 atau 7.3-7.5 (< 6.0 atau > 7.2)');
    console.log('   • MQ135: 105-120 (> 100)');
    console.log('   • Temperature: 16-21°C (> 15°C)');
    console.log('   • Warna: Kekuningan');

    console.log('\n✨ Selesai! Data sudah tersimpan di Firebase.');
    console.log('🔗 URL: https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app/readings');
    console.log('\n💡 Buka dashboard untuk melihat hasil: npm run dev');
}

// Jalankan upload
uploadData().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
