/**
 * Test File untuk Decision Tree Classifier
 *
 * Untuk menjalankan test ini:
 * 1. node test-decision-tree.js
 *
 * File ini akan menguji semua fungsi decision tree dan menampilkan hasil
 */

// Import tidak bisa langsung karena TypeScript, jadi kita simulasi di sini
// Untuk test sebenarnya, compile dulu TypeScript ke JavaScript

console.log('═══════════════════════════════════════════════════════════');
console.log('   🧪 TEST DECISION TREE CLASSIFIER - GOAT MILK QUALITY');
console.log('═══════════════════════════════════════════════════════════\n');

// Simulasi fungsi classifyMilkQuality
function classifyMilkQuality(data) {
  // Simplified version untuk testing
  const { ph, temperature, taste, odor, fat, turbidity, colour } = data;

  // Root: odor
  if (odor < 0) {
    // Bau buruk
    if (taste < -0.5) {
      return 'Buruk';
    } else {
      if (ph < 6.0) {
        return 'Buruk';
      } else {
        if (temperature < 15) {
          return 'Sedang';
        } else {
          return 'Buruk';
        }
      }
    }
  } else {
    // Bau normal atau segar
    if (taste < 0.5) {
      if (ph < 6.3) {
        return 'Sedang';
      } else {
        if (temperature < 10) {
          return 'Sedang';
        } else {
          if (turbidity < 1.5) {
            return 'Sedang';
          } else {
            return 'Buruk';
          }
        }
      }
    } else {
      // Rasa segar
      if (ph < 6.5) {
        if (temperature < 8) {
          return 'Sedang';
        } else {
          return 'Sedang';
        }
      } else {
        // pH >= 6.5
        if (ph < 6.9) {
          // pH optimal 6.5-6.9
          if (temperature < 4) {
            return 'Sedang';
          } else {
            if (temperature < 8) {
              // Suhu optimal 4-8
              if (fat < 3.5) {
                if (colour < 240) {
                  return 'Sedang';
                } else {
                  return 'Sedang';
                }
              } else {
                // Fat >= 3.5
                if (turbidity < 0.5) {
                  // Jernih
                  if (colour < 245) {
                    return 'Sedang';
                  } else {
                    return 'Baik'; // ✅ KUALITAS BAIK!
                  }
                } else {
                  return 'Sedang';
                }
              }
            } else {
              // Temp > 8
              if (temperature < 12) {
                return 'Sedang';
              } else {
                return 'Buruk';
              }
            }
          }
        } else {
          // pH > 6.9
          if (ph < 7.2) {
            return 'Sedang';
          } else {
            return 'Buruk';
          }
        }
      }
    }
  }
}

function getQualityScore(quality) {
  const scores = {
    'Baik': 85,
    'Sedang': 60,
    'Buruk': 30
  };
  return scores[quality];
}

function getQualityColor(quality) {
  const colors = {
    'Baik': '#10b981',
    'Sedang': '#f59e0b',
    'Buruk': '#ef4444'
  };
  return colors[quality];
}

function getQualityRecommendation(quality) {
  const recommendations = {
    'Baik': 'Susu dalam kondisi baik dan layak konsumsi. Simpan pada suhu 4-8°C.',
    'Sedang': 'Susu masih layak konsumsi namun perlu segera digunakan. Perhatikan suhu penyimpanan dan kebersihan.',
    'Buruk': 'Susu tidak layak konsumsi. Buang susu dan pastikan kebersihan peralatan pemerahan serta kondisi penyimpanan.'
  };
  return recommendations[quality];
}

// Test Cases
const testCases = [
  {
    name: 'Susu Berkualitas BAIK',
    data: {
      ph: 6.6,
      temperature: 6,
      taste: 1,
      odor: 1,
      fat: 3.8,
      turbidity: 0,
      colour: 250
    },
    expected: 'Baik',
    emoji: '🟢'
  },
  {
    name: 'Susu Berkualitas BAIK (Alternatif)',
    data: {
      ph: 6.7,
      temperature: 5,
      taste: 1,
      odor: 1,
      fat: 4.0,
      turbidity: 0,
      colour: 255
    },
    expected: 'Baik',
    emoji: '🟢'
  },
  {
    name: 'Susu Berkualitas SEDANG (pH rendah)',
    data: {
      ph: 6.3,
      temperature: 6,
      taste: 1,
      odor: 1,
      fat: 3.8,
      turbidity: 0,
      colour: 250
    },
    expected: 'Sedang',
    emoji: '🟡'
  },
  {
    name: 'Susu Berkualitas SEDANG (Suhu tinggi)',
    data: {
      ph: 6.6,
      temperature: 10,
      taste: 0,
      odor: 0,
      fat: 3.0,
      turbidity: 1,
      colour: 245
    },
    expected: 'Sedang',
    emoji: '🟡'
  },
  {
    name: 'Susu Berkualitas SEDANG (Fat rendah)',
    data: {
      ph: 6.6,
      temperature: 6,
      taste: 1,
      odor: 1,
      fat: 3.0,
      turbidity: 0,
      colour: 245
    },
    expected: 'Sedang',
    emoji: '🟡'
  },
  {
    name: 'Susu Berkualitas BURUK (pH sangat rendah)',
    data: {
      ph: 5.8,
      temperature: 6,
      taste: -1,
      odor: -1,
      fat: 3.8,
      turbidity: 0,
      colour: 250
    },
    expected: 'Buruk',
    emoji: '🔴'
  },
  {
    name: 'Susu Berkualitas BURUK (Suhu sangat tinggi)',
    data: {
      ph: 6.6,
      temperature: 18,
      taste: -1,
      odor: -1,
      fat: 2.0,
      turbidity: 2,
      colour: 230
    },
    expected: 'Buruk',
    emoji: '🔴'
  },
  {
    name: 'Susu Berkualitas BURUK (pH sangat tinggi)',
    data: {
      ph: 7.3,
      temperature: 6,
      taste: -1,
      odor: -1,
      fat: 2.5,
      turbidity: 2,
      colour: 235
    },
    expected: 'Buruk',
    emoji: '🔴'
  },
  {
    name: 'Susu dengan bau dan rasa buruk',
    data: {
      ph: 6.0,
      temperature: 12,
      taste: -1,
      odor: -1,
      fat: 2.5,
      turbidity: 2,
      colour: 235
    },
    expected: 'Buruk',
    emoji: '🔴'
  }
];

// Run Tests
let passed = 0;
let failed = 0;

console.log('📋 Menjalankan Test Cases...\n');

testCases.forEach((testCase, index) => {
  const result = classifyMilkQuality(testCase.data);
  const success = result === testCase.expected;

  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`${testCase.emoji} Expected: ${testCase.expected}`);
  console.log(`${success ? '✅' : '❌'} Result: ${result}`);

  if (success) {
    passed++;
    const score = getQualityScore(result);
    const color = getQualityColor(result);
    console.log(`   Skor: ${score}, Warna: ${color}`);
  } else {
    failed++;
    console.log(`   ⚠️  GAGAL! Expected ${testCase.expected} but got ${result}`);
  }

  console.log('');
});

// Summary
console.log('═══════════════════════════════════════════════════════════');
console.log('                       📊 HASIL TEST');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Total Test Cases: ${testCases.length}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
console.log('═══════════════════════════════════════════════════════════\n');

// Test Batch Classification
console.log('═══════════════════════════════════════════════════════════');
console.log('           🔄 TEST BATCH CLASSIFICATION');
console.log('═══════════════════════════════════════════════════════════\n');

const batchData = [
  { ph: 6.6, temperature: 6, taste: 1, odor: 1, fat: 3.8, turbidity: 0, colour: 250 },
  { ph: 6.7, temperature: 5, taste: 1, odor: 1, fat: 4.0, turbidity: 0, colour: 255 },
  { ph: 6.5, temperature: 7, taste: 1, odor: 1, fat: 3.9, turbidity: 0, colour: 252 },
  { ph: 6.3, temperature: 10, taste: 0, odor: 0, fat: 3.0, turbidity: 1, colour: 245 },
  { ph: 6.4, temperature: 12, taste: 0, odor: 0, fat: 2.8, turbidity: 1, colour: 240 },
  { ph: 5.8, temperature: 18, taste: -1, odor: -1, fat: 2.0, turbidity: 2, colour: 230 },
  { ph: 7.3, temperature: 20, taste: -1, odor: -1, fat: 1.8, turbidity: 3, colour: 220 }
];

const batchResults = batchData.map(data => classifyMilkQuality(data));

const stats = {
  total: batchResults.length,
  baik: batchResults.filter(r => r === 'Baik').length,
  sedang: batchResults.filter(r => r === 'Sedang').length,
  buruk: batchResults.filter(r => r === 'Buruk').length
};

stats.baikPercentage = (stats.baik / stats.total) * 100;
stats.sedangPercentage = (stats.sedang / stats.total) * 100;
stats.burukPercentage = (stats.buruk / stats.total) * 100;

console.log(`Total Sampel: ${stats.total}`);
console.log('');
console.log('Distribusi Kualitas:');
console.log(`🟢 Baik:   ${stats.baik} sampel (${stats.baikPercentage.toFixed(1)}%)`);
console.log(`🟡 Sedang: ${stats.sedang} sampel (${stats.sedangPercentage.toFixed(1)}%)`);
console.log(`🔴 Buruk:  ${stats.buruk} sampel (${stats.burukPercentage.toFixed(1)}%)`);
console.log('');

// Detail setiap sampel
console.log('Detail Hasil:');
batchResults.forEach((result, index) => {
  const data = batchData[index];
  const emoji = result === 'Baik' ? '🟢' : result === 'Sedang' ? '🟡' : '🔴';
  console.log(`${emoji} Sampel ${index + 1}: ${result}`);
  console.log(`   pH: ${data.ph}, Temp: ${data.temperature}°C, Odor: ${data.odor}, Taste: ${data.taste}`);
  console.log(`   Fat: ${data.fat}%, Turbidity: ${data.turbidity}, Colour: ${data.colour}`);
});

console.log('\n═══════════════════════════════════════════════════════════');
console.log('                  ✨ TEST SELESAI');
console.log('═══════════════════════════════════════════════════════════\n');

// Test Parameter Boundaries
console.log('═══════════════════════════════════════════════════════════');
console.log('           🎯 TEST PARAMETER BOUNDARIES');
console.log('═══════════════════════════════════════════════════════════\n');

const boundaryTests = [
  {
    name: 'pH Batas Bawah Optimal (6.5)',
    data: { ph: 6.5, temperature: 6, taste: 1, odor: 1, fat: 3.8, turbidity: 0, colour: 250 }
  },
  {
    name: 'pH Batas Atas Optimal (6.8)',
    data: { ph: 6.8, temperature: 6, taste: 1, odor: 1, fat: 3.8, turbidity: 0, colour: 250 }
  },
  {
    name: 'Temperature Batas Bawah (4°C)',
    data: { ph: 6.6, temperature: 4, taste: 1, odor: 1, fat: 3.8, turbidity: 0, colour: 250 }
  },
  {
    name: 'Temperature Batas Atas (8°C)',
    data: { ph: 6.6, temperature: 8, taste: 1, odor: 1, fat: 3.8, turbidity: 0, colour: 250 }
  },
  {
    name: 'Fat Batas Minimal Baik (3.5%)',
    data: { ph: 6.6, temperature: 6, taste: 1, odor: 1, fat: 3.5, turbidity: 0, colour: 250 }
  },
  {
    name: 'Colour Batas Minimal Baik (245)',
    data: { ph: 6.6, temperature: 6, taste: 1, odor: 1, fat: 3.8, turbidity: 0, colour: 245 }
  }
];

boundaryTests.forEach((test, index) => {
  const result = classifyMilkQuality(test.data);
  const emoji = result === 'Baik' ? '🟢' : result === 'Sedang' ? '🟡' : '🔴';
  console.log(`${index + 1}. ${test.name}`);
  console.log(`   Hasil: ${emoji} ${result}`);
  console.log(`   Rekomendasi: ${getQualityRecommendation(result).substring(0, 60)}...`);
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════');
console.log('              🎉 SEMUA TEST COMPLETED!');
console.log('═══════════════════════════════════════════════════════════');
console.log('\n💡 Catatan:');
console.log('   - Untuk test lengkap, compile TypeScript terlebih dahulu');
console.log('   - Import decision tree dari src/lib/decisionTree.ts');
console.log('   - Jalankan dengan: npm run test (jika sudah setup)');
console.log('\n📚 Dokumentasi lengkap ada di DECISION_TREE_GUIDE.md\n');
