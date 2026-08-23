/**
 * Helper to escape a single CSV field following RFC 4180
 */
export function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export interface TransactionCsvRecord {
  id: string;
  transaction_date: string;
  type: string;
  category_name?: string;
  wallet_name?: string;
  amount: number;
  description?: string;
}

/**
 * Generate CSV string with UTF-8 BOM from transactions array
 */
export function generateTransactionsCsv(records: TransactionCsvRecord[]): string {
  const headers = [
    "ID Transaksi",
    "Tanggal",
    "Tipe Transaksi",
    "Kategori",
    "Dompet / Rekening",
    "Nominal (IDR)",
    "Deskripsi / Catatan",
  ];

  const rows = records.map((r) => [
    escapeCsvField(r.id),
    escapeCsvField(r.transaction_date),
    escapeCsvField(r.type.toUpperCase()),
    escapeCsvField(r.category_name || "Lainnya"),
    escapeCsvField(r.wallet_name || "-"),
    escapeCsvField(r.amount),
    escapeCsvField(r.description || "-"),
  ]);

  const csvContent = [headers.map(escapeCsvField).join(","), ...rows.map((row) => row.join(","))].join("\r\n");

  // Prepend UTF-8 BOM for Excel compatibility
  return `\uFEFF${csvContent}`;
}
