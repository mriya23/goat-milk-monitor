/**
 * Script untuk menambahkan sample data TANPA sensor suhu
 * Hanya menggunakan: pH, MQ135, RGB, color, timestamp
 *
 * Cara menjalankan:
 * node add-correct-data.js
 */

const FIREBASE_URL = 'https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app';

// Fungsi helper untuk generate timestamp
function getTimestamp(minutesAgo = 0) {
    return Date.now() - (minutesAgo * 60 * 1000);
}

// Data sample dengan berbagai kualitas (TANPA TEMPERATURE)
const sampleData = {
    // ========== KUALITAS BAIK (10 data) ==========
    // Kriteria: pH 6.5-6.8, MQ135 < 70, Warna putih bersih
    'Reading001': {
        color: 'Putih',
        mq135: 45,
        pH: 6.6,
        rgb: '255,255,255',
        timestamp: getTimestamp(120) // 2 jam yang lalu
    },
    'Reading002': {
        color: 'Putih',
        mq135: 50,
        pH: 6.7,
        rgb: '254,254,254',
        timestamp: getTimestamp(110)
    },
    'Reading003': {
        color: 'Putih',
        mq135: 48,
        pH: 6.5,
        rgb: '255,253,255',
        timestamp: getTimestamp(100)
    },
    'Reading004': {
        color: 'Putih',
        mq135: 52,
        pH: 6.6,
        rgb: '253,255,254',
        timestamp: getTimestamp(90)
    },
    'Reading005': {
        color: 'Putih',
        mq135: 47,
        pH: 6.8,
        rgb: '255,255,253',
        timestamp: getTimestamp(80)
    },
    'Reading006': {
        color: 'Putih',
        mq135: 55,
        pH: 6.5,
        rgb: '254,255,255',
        timestamp: getTimestamp(70)
    },
    'Reading007': {
        color: 'Putih',
        mq135: 49,
        pH: 6.7,
        rgb: '255,254,254',
        timestamp: getTimestamp(60)
    },
    'Reading008': {
        color: 'Putih',
        mq135: 51,
        pH: 6.6,
        rgb: '253,254,255',
        timestamp: getTimestamp(50)
    },
    'Reading009': {
        color: 'Putih',
        mq135: 46,
        pH: 6.8,
        rgb: '255,255,252',
        timestamp: getTimestamp(40)
    },
    'Reading010': {
        color: 'Putih',
        mq135: 53,
        pH: 6.5,
        rgb: '254,253,255',
        timestamp: getTimestamp(30)
    },

    // ========== KUALITAS SEDANG (7 data) ==========
    // Kriteria: pH 6.2-6.9 (tidak optimal), MQ135 70-100, Warna putih kekuningan
    'Reading011': {
        color: 'Putih Kekuningan',
        mq135: 75,
        pH: 6.3,
        rgb: '248,245,240',
        timestamp: getTimestamp(25)
    },
    'Reading012': {
        color: 'Putih Kekuningan',
        mq135: 82,
        pH: 6.4,
        rgb: '245,242,238',
        timestamp: getTimestamp(22)
    },
    'Reading013': {
        color: 'Putih Kekuningan',
        mq135: 78,
        pH: 6.2,
        rgb: '246,244,241',
        timestamp: getTimestamp(20)
    },
    'Reading014': {
        color: 'Putih Kekuningan',
        mq135: 85,
        pH: 6.9,
        rgb: '243,240,235',
        timestamp: getTimestamp(18)
    },
    'Reading015': {
        color: 'Putih Kekuningan',
        mq135: 80,
        pH: 6.3,
        rgb: '247,243,239',
        timestamp: getTimestamp(15)
    },
    'Reading016': {
        color: 'Putih Kekuningan',
        mq135: 88,
        pH: 6.8,
        rgb: '244,241,237',
        timestamp: getTimestamp(12)
    },
    'Reading017': {
        color: 'Putih Kekuningan',
        mq135: 76,
        pH: 6.4,
        rgb: '246,242,240',
        timestamp: getTimestamp(10)
    },

    // ========== KUALITAS BURUK (8 data) ==========
    // Kriteria: pH < 6.0 atau > 7.2, MQ135 > 100, Warna kekuningan
    'Reading018': {
        color: 'Kekuningan',
        mq135: 105,
        pH: 5.8,
        rgb: '235,225,210',
        timestamp: getTimestamp(8)
    },
    'Reading019': {
        color: 'Kekuningan',
        mq135: 112,
        pH: 5.9,
        rgb: '230,220,205',
        timestamp: getTimestamp(7)
    },
    'Reading020': {
        color: 'Kekuningan',
        mq135: 108,
        pH: 7.3,
        rgb: '232,222,208',
        timestamp: getTimestamp(6)
    },
    'Reading021': {
        color: 'Kekuningan',
        mq135: 115,
        pH: 5.7,
        rgb: '228,218,203',
        timestamp: getTimestamp(5)
    },
    'Reading022': {
        color: 'Kekuningan',
        mq135: 110,
        pH: 7.4,
        rgb: '233,223,207',
        timestamp: getTimestamp(4)
    },
    'Reading023': {
        color: 'Kekuningan',
        mq135: 118,
        pH: 5.6,
        rgb: '225,215,200',
        timestamp: getTimestamp(3)
    },
    'Reading024': {
        color: 'Kekuningan',
        mq135: 107,
        pH: 7.5,
        rgb: '234,224,209',
        timestamp: getTimestamp(2)
    },
    'Reading025': {
        color: 'Kekuningan',
        mq135: 120,
        pH: 5.5,
        rgb: '220,210,195',
        timestamp: getTimestamp(1)
    }
};

// Fungsi untuk hapus semua data lama
async function deleteOldData() {
    console.log('🗑️  Menghapus data lama dari Firebase...\n');

    try {
        const response = await fetch(`${FIREBASE_URL}/readings.json`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('✅ Data lama berhasil dihapus\n');
            return true;
        } else {
            console.log('⚠️  Tidak ada data lama atau gagal hapus\n');
            return false;
        }
    } catch (error) {
        console.log('⚠️  Error saat hapus data lama:', error.message);
        return false;
    }
}

// Fungsi untuk upload data ke Firebase
async function uploadData() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║     🚀 UPLOAD DATA KE FIREBASE (TANPA SENSOR SUHU)           ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    // Hapus data lama dulu
    await deleteOldData();

    let successCount = 0;
    let failCount = 0;

    console.log('📤 Mengupload data baru...\n');

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
                // Tentukan kualitas berdasarkan parameter (TANPA TEMPERATURE)
                let quality = 'Unknown';
                if (data.pH >= 6.5 && data.pH <= 6.8 && data.mq135 < 70) {
                    quality = '🟢 Baik';
                } else if (data.pH < 6.0 || data.pH > 7.2 || data.mq135 > 100) {
                    quality = '🔴 Buruk';
                } else {
                    quality = '🟡 Sedang';
                }

                console.log(`✅ ${key}: ${quality} (pH: ${data.pH}, MQ135: ${data.mq135})`);
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

    console.log('\n' + '═'.repeat(67));
    console.log('📊 RINGKASAN UPLOAD');
    console.log('═'.repeat(67));
    console.log(`Total data: ${Object.keys(sampleData).length}`);
    console.log(`✅ Berhasil: ${successCount}`);
    console.log(`❌ Gagal: ${failCount}`);
    console.log('═'.repeat(67));

    console.log('\n📈 DISTRIBUSI KUALITAS:');
    console.log('🟢 Baik: 10 data (Reading001-Reading010)');
    console.log('   • pH: 6.5-6.8 (optimal)');
    console.log('   • MQ135: 45-55 (< 70, udara segar)');
    console.log('   • Warna: Putih bersih (RGB: 253-255)');

    console.log('\n🟡 Sedang: 7 data (Reading011-Reading017)');
    console.log('   • pH: 6.2-6.9 (tidak optimal)');
    console.log('   • MQ135: 75-88 (70-100, udara kurang baik)');
    console.log('   • Warna: Putih kekuningan (RGB: 240-248)');

    console.log('\n🔴 Buruk: 8 data (Reading018-Reading025)');
    console.log('   • pH: 5.5-5.9 atau 7.3-7.5 (< 6.0 atau > 7.2)');
    console.log('   • MQ135: 105-120 (> 100, udara buruk)');
    console.log('   • Warna: Kekuningan (RGB: 195-235)');

    console.log('\n🎯 PARAMETER YANG DIGUNAKAN:');
    console.log('   ✅ pH (sensor pH)');
    console.log('   ✅ MQ135 (sensor kualitas udara)');
    console.log('   ✅ RGB (sensor warna TCS3200)');
    console.log('   ✅ color (deskripsi warna)');
    console.log('   ✅ timestamp (waktu pembacaan)');
    console.log('   ❌ temperature (TIDAK ADA - tidak menggunakan sensor suhu)');

    console.log('\n📊 EXPECTED DASHBOARD RESULTS:');
    console.log('   • Total Readings: 25');
    console.log('   • Avg pH: ~6.4');
    console.log('   • Avg MQ135: ~78');
    console.log('   • Kualitas Baik: 10 (40%)');
    console.log('   • Kualitas Sedang: 7 (28%)');
    console.log('   • Kualitas Buruk: 8 (32%)');

    console.log('\n✨ Selesai! Data sudah tersimpan di Firebase.');
    console.log('🔗 URL: https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app/readings');
    console.log('\n💡 Buka dashboard untuk melihat hasil:');
    console.log('   npm run dev');
    console.log('   http://localhost:4321');

    console.log('\n⚠️  CATATAN PENTING:');
    console.log('   Decision Tree akan menggunakan default temperature = 6°C');
    console.log('   karena tidak ada sensor suhu di hardware.');
}

// Jalankan upload
uploadData().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
