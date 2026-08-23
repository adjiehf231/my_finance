import React, { useState } from "react";

export interface QuickAddTransactionProps {
  wallets: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; type: string }>;
  onSubmit: (data: {
    type: "income" | "expense" | "transfer";
    amount: number;
    walletId: string;
    categoryId?: string;
    description: string;
  }) => void;
  onCancel: () => void;
}

export function QuickAddTransactionScreen({
  wallets,
  categories,
  onSubmit,
  onCancel,
}: QuickAddTransactionProps) {
  const [type, setType] = useState<"income" | "expense" | "transfer">("expense");
  const [amount, setAmount] = useState<string>("");
  const [walletId, setWalletId] = useState<string>(wallets[0]?.id || "");
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || "");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      amount: parseFloat(amount) || 0,
      walletId,
      categoryId,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        {(["expense", "income", "transfer"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize ${
              type === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700">Nominal</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full h-12 px-3 border rounded-2xl text-lg font-bold"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-slate-100 rounded-2xl text-xs font-bold text-slate-700"
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-emerald-600 rounded-2xl text-xs font-bold text-white"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}
