import React, { useEffect } from 'react';
import { Compass, RotateCcw, X } from 'lucide-react';

interface ResetTripModalProps {
  isOpen: boolean;
  destination: string;
  packedCount: number;
  onClose: () => void;
  onUncheckAll: () => void;
  onStartNewTrip: () => void;
}

export const ResetTripModal: React.FC<ResetTripModalProps> = ({
  isOpen,
  destination,
  packedCount,
  onClose,
  onUncheckAll,
  onStartNewTrip,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3C2F80]/30 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-[#EAE6F8] rounded-3xl p-6 sm:p-7 shadow-[0_20px_40px_-8px_rgba(60,47,128,0.16)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="reset-modal-title"
              className="text-[22px] leading-[28px] font-semibold text-[#3C2F80]"
            >
              Reset or Start a New Trip
            </h2>
            <p className="mt-1.5 text-sm text-[#6B619B] leading-relaxed">
              Choose whether to clear checkmarks for{' '}
              <span className="font-semibold text-[#3C2F80]">
                {destination}
              </span>{' '}
              or wipe this manifest to plan a brand-new voyage.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="min-h-[40px] min-w-[40px] rounded-xl text-[#6B619B] hover:text-[#3C2F80] hover:bg-[#F8F7FC] flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {/* Option 1: Uncheck all items for same itinerary */}
          <button
            type="button"
            disabled={packedCount === 0}
            onClick={() => {
              onUncheckAll();
              onClose();
            }}
            className="w-full min-h-[52px] px-4 py-3 rounded-2xl border border-[#EAE6F8] text-left hover:bg-[#5D3BE0]/[0.06] disabled:opacity-45 disabled:pointer-events-none transition-colors duration-150 cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F8F7FC] border border-[#EAE6F8] flex items-center justify-center text-[#5D3BE0] shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#3C2F80]">
                Uncheck All Packed Items
              </p>
              <p className="text-xs text-[#6B619B] tabular-nums">
                Keep your items and reset progress ({packedCount} checked) to 0%
              </p>
            </div>
          </button>

          {/* Option 2: Clear current trip and return to Destination & Days form */}
          <button
            type="button"
            onClick={() => {
              onStartNewTrip();
              onClose();
            }}
            className="w-full min-h-[52px] px-4 py-3 rounded-2xl bg-[#5D3BE0] hover:bg-[#9E5AFD] text-white text-left transition-colors duration-150 cursor-pointer flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Start New Trip</p>
              <p className="text-xs text-white/85">
                Clear current manifest and enter a new destination &amp; days
              </p>
            </div>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-[#EAE6F8] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold text-[#6B619B] hover:text-[#3C2F80] hover:bg-[#F8F7FC] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
