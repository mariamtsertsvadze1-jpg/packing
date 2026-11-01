import React, { useState } from 'react';
import { AlertCircle, Minus, Plus } from 'lucide-react';
import { CategoryName } from '../types';
import { ALL_CATEGORIES } from '../data/packingTemplates';

interface AddCustomItemBarProps {
  onAddItem: (item: {
    name: string;
    category: CategoryName;
    quantity: number;
    note?: string;
  }) => void;
}

export const AddCustomItemBar: React.FC<AddCustomItemBarProps> = ({
  onAddItem,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryName>('Custom Essentials');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a custom item name.');
      return;
    }

    const safeQty = Math.max(1, Math.min(99, Math.round(quantity) || 1));
    onAddItem({
      name: trimmed,
      category,
      quantity: safeQty,
    });

    setName('');
    setQuantity(1);
    setError(null);
  };

  return (
    <section
      id="add-custom-item"
      aria-label="Add Custom Packing Item"
      className="bg-white border border-[#EAE6F8] rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(60,47,128,0.04)]"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col lg:flex-row lg:items-end gap-3.5">
          {/* Item Name Input */}
          <div className="flex-1 min-w-0">
            <label
              htmlFor="custom-item-name"
              className="block text-xs font-semibold text-[#3C2F80] mb-1.5"
            >
              Add Custom Item
            </label>
            <input
              id="custom-item-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g., 35mm Film Camera, Espresso Maker, Hiking Poles..."
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'custom-item-error' : undefined}
              className={`voyage-input w-full h-12 px-4 bg-white border rounded-xl text-base text-[#3C2F80] placeholder:text-[#6B619B]/60 ${
                error ? 'border-[#BA1A1A]' : 'border-[#EAE6F8]'
              }`}
            />
          </div>

          {/* Category Selector */}
          <div className="w-full sm:w-auto lg:w-56 shrink-0">
            <label
              htmlFor="custom-item-category"
              className="block text-xs font-semibold text-[#3C2F80] mb-1.5"
            >
              Category
            </label>
            <select
              id="custom-item-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryName)}
              className="voyage-input w-full h-12 px-3.5 bg-white border border-[#EAE6F8] rounded-xl text-sm font-medium text-[#3C2F80]"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Stepper & Submit */}
          <div className="flex items-end gap-3 shrink-0">
            <div>
              <span className="block text-xs font-semibold text-[#3C2F80] mb-1.5">
                Qty
              </span>
              <div className="inline-flex items-center h-12 rounded-xl border border-[#EAE6F8] bg-[#F8F7FC] px-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-10 rounded-lg text-[#3C2F80] hover:bg-white transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-[#3C2F80] tabular-nums select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                  className="w-9 h-10 rounded-lg text-[#3C2F80] hover:bg-white transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex-1 sm:flex-initial min-h-[48px] px-5 py-3 bg-[#5D3BE0] hover:bg-[#9E5AFD] active:scale-[0.99] text-white text-sm font-semibold rounded-2xl transition-all duration-150 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add Custom Item</span>
            </button>
          </div>
        </div>

        {error && (
          <p
            id="custom-item-error"
            role="alert"
            className="mt-2 text-xs font-medium text-[#BA1A1A] flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </form>
    </section>
  );
};
