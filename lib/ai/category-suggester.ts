export interface SuggestionCategory {
  id: string;
  name: string;
  type: "income" | "expense";
  color?: string;
}

interface KeywordRule {
  keywords: string[];
  categoryPatterns: string[];
}

const INDONESIAN_CATEGORY_RULES: KeywordRule[] = [
  {
    keywords: [
      "makan", "minum", "kopi", "cafe", "kafe", "resto", "restoran", "warung",
      "gofood", "grabfood", "shopeefood", "bakso", "mie", "nasi", "ayam",
      "soto", "sate", "pizza", "burger", "starbucks", "kenangan", "janji jiwa",
      "indomaret", "alfamart", "snack", "roti", "jajan"
    ],
    categoryPatterns: ["makan", "kuliner", "food", "f&b", "konsumsi"],
  },
  {
    keywords: [
      "bensin", "pertamax", "pertalite", "shell", "spbu", "bbm", "parkir", "tol",
      "gojek", "goride", "gocar", "grab", "grabcar", "maxim", "kereta", "krl",
      "mrt", "lrt", "bus", "transjakarta", "tiket", "service", "bengkel", "oli"
    ],
    categoryPatterns: ["transport", "kendaraan", "bensin", "perjalanan"],
  },
  {
    keywords: [
      "listrik", "pln", "token", "air", "pdam", "wifi", "indihome", "biznet",
      "firstmedia", "pulsa", "kuota", "telkomsel", "indosat", "xl", "smartfren",
      "iuran", "ipl", "sampah", "keamanan", "pajak", "pbb"
    ],
    categoryPatterns: ["tagihan", "utilitas", "bills", "listrik", "air"],
  },
  {
    keywords: [
      "baju", "celana", "sepatu", "tas", "tokopedia", "shopee", "lazada",
      "zalora", "mall", "supermarket", "hypermart", "superindo", "belanja",
      "skincare", "makeup", "kosmetik", "parfum", "elektronik"
    ],
    categoryPatterns: ["belanja", "shopping", "pakaian", "fashion", "kebutuhan"],
  },
  {
    keywords: [
      "netflix", "spotify", "youtube", "disney", "bioskop", "cinema", "xxi",
      "cgv", "game", "steam", "playstation", "nintendo", "liburan", "hotel",
      "staycation", "wisata", "rekreasi"
    ],
    categoryPatterns: ["hiburan", "entertainment", "rekreasi", "hobi"],
  },
  {
    keywords: [
      "obat", "apotek", "dokter", "klinik", "rumah sakit", "rs", "vitamin",
      "suplemen", "bpjs", "asuransi", "dental", "gigi", "lab", "tes"
    ],
    categoryPatterns: ["kesehatan", "medis", "health", "obat"],
  },
  {
    keywords: [
      "sekolah", "spp", "kursus", "bimbingan", "bimbel", "kuliah", "buku",
      "pelatihan", "sertifikasi", "udemy", "coursera"
    ],
    categoryPatterns: ["pendidikan", "edukasi", "kursus", "belajar"],
  },
  {
    keywords: [
      "gaji", "salary", "bonus", "thr", "dividen", "bunga", "cashback",
      "hadiah", "fee", "proyek", "freelance", "penjualan", "omset"
    ],
    categoryPatterns: ["gaji", "pendapatan", "penghasilan", "income", "bonus"],
  },
];

/**
 * Suggests the best matching category from the available category list based on description keywords
 */
export function suggestCategoryFromDescription(
  description: string,
  categories: SuggestionCategory[]
): SuggestionCategory | null {
  if (!description || !description.trim() || categories.length === 0) {
    return null;
  }

  const cleanDesc = description.toLowerCase();

  for (const rule of INDONESIAN_CATEGORY_RULES) {
    const hasKeyword = rule.keywords.some((kw) => cleanDesc.includes(kw));

    if (hasKeyword) {
      // Find matching category in the user's available categories
      const matchedCategory = categories.find((cat) => {
        const catName = cat.name.toLowerCase();
        return rule.categoryPatterns.some((pat) => catName.includes(pat));
      });

      if (matchedCategory) {
        return matchedCategory;
      }
    }
  }

  return null;
}
