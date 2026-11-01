import React, { useState } from 'react';
import {
  Check,
  Compass,
  CreditCard,
  Headphones,
  HeartPulse,
  PackagePlus,
  Plus,
  Shirt,
  Trash2,
} from 'lucide-react';
import { CategoryName, PackingItem } from '../types';

interface CategoryCardProps {
  category: CategoryName;
  items: PackingItem[];
  totalCategoryCount: number;
  packedCategoryCount: number;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onQuickAddInCategory: (name: string, category: CategoryName) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  items,
  totalCategoryCount,
  packedCategoryCount,
  onToggleItem,
  onDeleteItem,
  onQuickAddInCategory,
}) => {
  const [quickName, setQuickName] = useState('');
  const [showQuickInput, setShowQuickInput] = useState(false);

  const isCategoryComplete =
    totalCategoryCount > 0 && packedCategoryCount === totalCategoryCount;

  const getCategoryIcon = (cat: CategoryName) => {
    switch (cat) {
      case 'Documents & Boarding':
        return <CreditCard className="w-4 h-4 text-[#5D3BE0]" />;
      case 'Apparel & Footwear':
        return <Shirt className="w-4 h-4 text-[#5D3BE0]" />;
      case 'Toiletries & Wellness':
        return <HeartPulse className="w-4 h-4 text-[#5D3BE0]" />;
      case 'Cabin & Electronics':
        return <Headphones className="w-4 h-4 text-[#5D3BE0]" />;
      case 'Destination Gear':
        return <Compass className="w-4 h-4 text-[#5D3BE0]" />;
      case 'Custom Essentials':
        return <PackagePlus className="w-4 h-4 text-[#5D3BE0]" />;
    }
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickName.trim();
    if (!trimmed) return;
    onQuickAddInCategory(trimmed, category);
    setQuickName('');
    setShowQuickInput(false);
  };

  return (
    <article className="bg-white border border-[#EAE6F8] rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(60,47,128,0.04)] flex flex-col justify-between">
      <div>
        {/* Category Header + Progress Chip */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#EAE6F8]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#F8F7FC] border border-[#EAE6F8] flex items-center justify-center shrink-0">
              {getCategoryIcon(category)}
            </div>
            <h2 className="text-[18px] leading-[24px] font-semibold text-[#3C2F80] truncate">
              {category}
            </h2>
          </div>

          {/* Category Progress Chip per Earth Voyage spec */}
          <span
            aria-label={`${packedCategoryCount} of ${totalCategoryCount} packed in ${category}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold tabular-nums inline-flex items-center gap-1.5 shrink-0 transition-colors duration-150 ${
              isCategoryComplete
                ? 'bg-[#10B981]/12 text-[#10B981]'
                : 'bg-[#5D3BE0]/10 text-[#5D3BE0]'
            }`}
          >
            {isCategoryComplete && (
              <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
            )}
            <span>
              {packedCategoryCount}/{totalCategoryCount}
            </span>
          </span>
        </div>

        {/* Checklist Items */}
        <ul className="mt-4 space-y-2.5" role="list">
          {items.map((item) => {
            const checkedColorClass = isCategoryComplete
              ? 'bg-[#10B981] border-[#10B981]'
              : 'bg-[#5D3BE0] border-[#5D3BE0]';

            return (
              <li
                key={item.id}
                className={`group flex items-center justify-between gap-3 bg-white border border-[#EAE6F8] rounded-xl px-3.5 py-2.5 transition-all duration-150 hover:border-[#9E5AFD]/50 ${
                  item.packed ? 'opacity-65' : 'opacity-100'
                }`}
              >
                <label className="flex items-center gap-3.5 flex-1 min-w-0 min-h-[44px] py-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={item.packed}
                    onChange={() => onToggleItem(item.id)}
                    className="sr-only peer"
                  />
                  {/* Custom 22px x 22px Checkbox per Earth Voyage spec */}
                  <span
                    aria-hidden="true"
                    className={`w-[22px] h-[22px] rounded-[6px] flex items-center justify-center shrink-0 transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-[#5D3BE0] peer-focus-visible:ring-offset-2 ${
                      item.packed
                        ? checkedColorClass
                        : 'bg-white border-2 border-[#6B619B]/40 group-hover:border-[#5D3BE0]'
                    }`}
                  >
                    {item.packed && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span
                        className={`text-[16px] leading-[24px] break-words transition-colors duration-150 ${
                          item.packed
                            ? 'line-through text-[#6B619B]'
                            : 'text-[#3C2F80] font-normal'
                        }`}
                      >
                        {item.name}
                      </span>

                      {item.quantity > 1 && (
                        <span className="text-xs font-semibold text-[#6B619B] tabular-nums">
                          ×{item.quantity}
                        </span>
                      )}
                    </div>

                    {item.note && (
                      <p className="text-xs text-[#6B619B] mt-0.5 truncate">
                        {item.note}
                      </p>
                    )}
                  </div>
                </label>

                {/* Destructive / Remove Action */}
                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  aria-label={`Delete ${item.name}`}
                  title={`Remove ${item.name}`}
                  className="min-h-[44px] min-w-[44px] rounded-xl text-[#6B619B] hover:text-[#BA1A1A] hover:bg-[#FFDAD6]/35 transition-colors duration-150 flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Per-Category Quick Add Control */}
      <div className="mt-4 pt-3 border-t border-[#EAE6F8]/70">
        {!showQuickInput ? (
          <button
            type="button"
            onClick={() => setShowQuickInput(true)}
            className="min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#6B619B] hover:text-[#5D3BE0] hover:bg-[#5D3BE0]/[0.06] transition-colors duration-150 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add item to {category}</span>
          </button>
        ) : (
          <form onSubmit={handleQuickSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              placeholder={`New item in ${category}...`}
              autoFocus
              className="voyage-input flex-1 h-10 px-3 bg-white border border-[#EAE6F8] rounded-xl text-sm text-[#3C2F80] placeholder:text-[#6B619B]/60"
            />
            <button
              type="submit"
              disabled={!quickName.trim()}
              className="h-10 px-3.5 rounded-xl bg-[#5D3BE0] hover:bg-[#9E5AFD] disabled:opacity-45 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowQuickInput(false);
                setQuickName('');
              }}
              className="h-10 px-3 rounded-xl border border-[#EAE6F8] text-xs font-semibold text-[#6B619B] hover:text-[#3C2F80] cursor-pointer whitespace-nowrap shrink-0"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </article>
  );
};
