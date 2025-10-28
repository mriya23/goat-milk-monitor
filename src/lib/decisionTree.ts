/**
 * Decision Tree Classifier untuk Klasifikasi Kualitas Susu
 * Mengklasifikasikan susu menjadi: Baik, Sedang, atau Buruk
 */

export interface MilkData {
  ph?: number;
  temperature?: number;
  taste?: number;
  odor?: number;
  fat?: number;
  turbidity?: number;
  colour?: number;
}

export type QualityClass = 'Baik' | 'Sedang' | 'Buruk';

export interface DecisionTreeNode {
  feature?: string;
  threshold?: number;
  left?: DecisionTreeNode;
  right?: DecisionTreeNode;
  class?: QualityClass;
}

/**
 * Decision Tree berdasarkan parameter kualitas susu kambing
 *
 * Kriteria kualitas:
 * - pH: 6.5-6.8 (optimal), <6.5 atau >6.8 (sedang), <6.0 atau >7.2 (buruk)
 * - Temperature: 4-8°C (baik), 8-15°C (sedang), >15°C (buruk)
 * - Taste: 1 (fresh/baik), 0 (sedang/agak asam), -1 (buruk/sangat asam)
 * - Odor: 1 (fresh/baik), 0 (sedang), -1 (buruk/tengik)
 * - Fat: >3.5% (baik), 2.5-3.5% (sedang), <2.5% (buruk)
 * - Turbidity: 0 (jernih/baik), 1 (sedikit keruh/sedang), 2+ (keruh/buruk)
 * - Colour: 255 (putih bersih/baik), 240-254 (sedang), <240 (kekuningan/buruk)
 */
const decisionTree: DecisionTreeNode = {
  feature: 'odor',
  threshold: 0,
  left: { // odor < 0 (bau buruk/tengik)
    feature: 'taste',
    threshold: -0.5,
    left: { // taste < -0.5 (rasa sangat buruk)
      class: 'Buruk'
    },
    right: { // taste >= -0.5
      feature: 'ph',
      threshold: 6.0,
      left: { // pH < 6.0 (terlalu asam)
        class: 'Buruk'
      },
      right: { // pH >= 6.0
        feature: 'temperature',
        threshold: 15,
        left: {
          class: 'Sedang'
        },
        right: {
          class: 'Buruk'
        }
      }
    }
  },
  right: { // odor >= 0 (bau normal atau segar)
    feature: 'taste',
    threshold: 0.5,
    left: { // taste < 0.5 (rasa tidak segar)
      feature: 'ph',
      threshold: 6.3,
      left: { // pH < 6.3
        class: 'Sedang'
      },
      right: { // pH >= 6.3
        feature: 'temperature',
        threshold: 10,
        left: {
          class: 'Sedang'
        },
        right: {
          feature: 'turbidity',
          threshold: 1.5,
          left: {
            class: 'Sedang'
          },
          right: {
            class: 'Buruk'
          }
        }
      }
    },
    right: { // taste >= 0.5 (rasa segar)
      feature: 'ph',
      threshold: 6.5,
      left: { // pH < 6.5
        feature: 'temperature',
        threshold: 8,
        left: {
          class: 'Sedang'
        },
        right: {
          class: 'Sedang'
        }
      },
      right: { // pH >= 6.5
        feature: 'ph',
        threshold: 6.9,
        left: { // pH 6.5-6.9 (optimal)
          feature: 'temperature',
          threshold: 4,
          left: { // temp < 4 (terlalu dingin)
            class: 'Sedang'
          },
          right: { // temp >= 4
            feature: 'temperature',
            threshold: 8,
            left: { // temp 4-8°C (optimal)
              feature: 'fat',
              threshold: 3.5,
              left: { // fat < 3.5%
                feature: 'colour',
                threshold: 240,
                left: {
                  class: 'Sedang'
                },
                right: {
                  class: 'Sedang'
                }
              },
              right: { // fat >= 3.5% (baik)
                feature: 'turbidity',
                threshold: 0.5,
                left: { // turbidity < 0.5 (jernih)
                  feature: 'colour',
                  threshold: 245,
                  left: {
                    class: 'Sedang'
                  },
                  right: { // colour >= 245 (putih bersih)
                    class: 'Baik'
                  }
                },
                right: { // turbidity >= 0.5
                  class: 'Sedang'
                }
              }
            },
            right: { // temp > 8°C
              feature: 'temperature',
              threshold: 12,
              left: {
                class: 'Sedang'
              },
              right: {
                class: 'Buruk'
              }
            }
          }
        },
        right: { // pH > 6.9
          feature: 'ph',
          threshold: 7.2,
          left: {
            class: 'Sedang'
          },
          right: {
            class: 'Buruk'
          }
        }
      }
    }
  }
};

/**
 * Traverse decision tree untuk klasifikasi
 */
function traverseTree(node: DecisionTreeNode, data: MilkData): QualityClass {
  // Jika sudah di leaf node, return class
  if (node.class) {
    return node.class;
  }

  // Ambil nilai feature
  const featureValue = data[node.feature as keyof MilkData];

  // Jika feature tidak ada, return default
  if (featureValue === undefined || featureValue === null) {
    return 'Sedang'; // Default jika data tidak lengkap
  }

  // Traverse ke left atau right berdasarkan threshold
  if (featureValue < (node.threshold || 0)) {
    return traverseTree(node.left!, data);
  } else {
    return traverseTree(node.right!, data);
  }
}

/**
 * Klasifikasi kualitas susu menggunakan decision tree
 * @param data - Data parameter susu
 * @returns Kualitas susu: 'Baik', 'Sedang', atau 'Buruk'
 */
export function classifyMilkQuality(data: MilkData): QualityClass {
  // Validasi input
  if (!data || Object.keys(data).length === 0) {
    return 'Sedang';
  }

  return traverseTree(decisionTree, data);
}

/**
 * Mendapatkan skor kualitas numerik (0-100)
 * @param quality - Kualitas susu
 * @returns Skor 0-100
 */
export function getQualityScore(quality: QualityClass): number {
  const scoreMap: Record<QualityClass, number> = {
    'Baik': 85,
    'Sedang': 60,
    'Buruk': 30
  };
  return scoreMap[quality];
}

/**
 * Mendapatkan warna untuk kualitas
 * @param quality - Kualitas susu
 * @returns Kode warna hex
 */
export function getQualityColor(quality: QualityClass): string {
  const colorMap: Record<QualityClass, string> = {
    'Baik': '#10b981', // green
    'Sedang': '#f59e0b', // orange
    'Buruk': '#ef4444' // red
  };
  return colorMap[quality];
}

/**
 * Mendapatkan rekomendasi berdasarkan kualitas
 * @param quality - Kualitas susu
 * @returns Pesan rekomendasi
 */
export function getQualityRecommendation(quality: QualityClass): string {
  const recommendationMap: Record<QualityClass, string> = {
    'Baik': 'Susu dalam kondisi baik dan layak konsumsi. Simpan pada suhu 4-8°C.',
    'Sedang': 'Susu masih layak konsumsi namun perlu segera digunakan. Perhatikan suhu penyimpanan dan kebersihan.',
    'Buruk': 'Susu tidak layak konsumsi. Buang susu dan pastikan kebersihan peralatan pemerahan serta kondisi penyimpanan.'
  };
  return recommendationMap[quality];
}

/**
 * Klasifikasi batch data susu
 * @param dataArray - Array data susu
 * @returns Array hasil klasifikasi
 */
export function classifyBatch(dataArray: MilkData[]): Array<{
  data: MilkData;
  quality: QualityClass;
  score: number;
  color: string;
  recommendation: string;
}> {
  return dataArray.map(data => {
    const quality = classifyMilkQuality(data);
    return {
      data,
      quality,
      score: getQualityScore(quality),
      color: getQualityColor(quality),
      recommendation: getQualityRecommendation(quality)
    };
  });
}

/**
 * Mendapatkan statistik kualitas dari batch data
 * @param dataArray - Array data susu
 * @returns Statistik kualitas
 */
export function getQualityStatistics(dataArray: MilkData[]): {
  total: number;
  baik: number;
  sedang: number;
  buruk: number;
  baikPercentage: number;
  sedangPercentage: number;
  burukPercentage: number;
} {
  const results = classifyBatch(dataArray);
  const total = results.length;
  const baik = results.filter(r => r.quality === 'Baik').length;
  const sedang = results.filter(r => r.quality === 'Sedang').length;
  const buruk = results.filter(r => r.quality === 'Buruk').length;

  return {
    total,
    baik,
    sedang,
    buruk,
    baikPercentage: total > 0 ? (baik / total) * 100 : 0,
    sedangPercentage: total > 0 ? (sedang / total) * 100 : 0,
    burukPercentage: total > 0 ? (buruk / total) * 100 : 0
  };
}
