/**
 * Script untuk update timestamp semua data menjadi REAL-TIME (sekarang)
 *
 * Cara menjalankan:
 * node update-timestamps.js
 */

const FIREBASE_URL = 'https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app';

// Fungsi untuk update timestamp data
async function updateTimestamps() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║        🕒 UPDATE TIMESTAMP KE REAL-TIME (SEKARANG)           ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    try {
        // 1. Ambil semua data dari Firebase
        console.log('📥 Mengambil data dari Firebase...');
        const response = await fetch(`${FIREBASE_URL}/readings.json`);
        const data = await response.json();

        if (!data) {
            console.log('❌ Tidak ada data di Firebase!');
            return;
        }

        const readings = Object.entries(data);
        console.log(`✅ Ditemukan ${readings.length} data\n`);

        // 2. Hitung timestamp untuk setiap reading
        const now = Date.now();
        const intervals = [
            120, 110, 100, 90, 80, 70, 60, 50, 40, 30,  // Reading 1-10 (Baik)
            25, 22, 20, 18, 15, 12, 10,                  // Reading 11-17 (Sedang)
            8, 7, 6, 5, 4, 3, 2, 1                       // Reading 18-25 (Buruk)
        ];

        console.log('📤 Mengupdate timestamp...\n');

        let successCount = 0;
        let failCount = 0;

        // 3. Update setiap reading dengan timestamp baru
        for (let i = 0; i < readings.length; i++) {
            const [key, reading] = readings[i];

            // Hitung timestamp (menit yang lalu dari sekarang)
            const minutesAgo = intervals[i] || (readings.length - i);
            const newTimestamp = now - (minutesAgo * 60 * 1000);

            // Update data dengan timestamp baru
            const updatedReading = {
                ...reading,
                timestamp: newTimestamp
            };

            try {
                const updateResponse = await fetch(`${FIREBASE_URL}/readings/${key}.json`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedReading)
                });

                if (updateResponse.ok) {
                    const date = new Date(newTimestamp);
                    console.log(`✅ ${key}: ${minutesAgo} menit yang lalu (${date.toLocaleString('id-ID')})`);
                    successCount++;
                } else {
                    console.log(`❌ ${key}: Gagal update`);
                    failCount++;
                }

                // Delay kecil
                await new Promise(resolve => setTimeout(resolve, 50));

            } catch (error) {
                console.log(`❌ ${key}: Error - ${error.message}`);
                failCount++;
            }
        }

        // 4. Tampilkan ringkasan
        console.log('\n' + '═'.repeat(67));
        console.log('📊 RINGKASAN UPDATE');
        console.log('═'.repeat(67));
        console.log(`Total data: ${readings.length}`);
        console.log(`✅ Berhasil: ${successCount}`);
        console.log(`❌ Gagal: ${failCount}`);
        console.log('═'.repeat(67));

        // 5. Tampilkan data terbaru
        console.log('\n📍 DATA TERBARU (Latest Reading):');
        const latestKey = readings[readings.length - 1][0];
        const latestReading = readings[readings.length - 1][1];
        const latestTimestamp = now - (intervals[readings.length - 1] * 60 * 1000);
        const latestDate = new Date(latestTimestamp);

        console.log(`   Key: ${latestKey}`);
        console.log(`   pH: ${latestReading.pH}`);
        console.log(`   MQ135: ${latestReading.mq135}`);
        console.log(`   Warna: ${latestReading.color}`);
        console.log(`   Waktu: ${latestDate.toLocaleString('id-ID')}`);
        console.log(`   Timestamp: ${latestTimestamp}`);

        console.log('\n✨ Selesai! Semua timestamp sudah diupdate ke waktu sekarang.');
        console.log('🔗 URL: https://goat-milk-monitor-default-rtdb.asia-southeast1.firebasedatabase.app/readings');
        console.log('\n💡 Buka dashboard untuk melihat hasil:');
        console.log('   npm run dev');
        console.log('   http://localhost:4321');
        console.log('\n📅 Data sekarang menampilkan waktu REAL-TIME (hari ini)!');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Jalankan update
updateTimestamps();
