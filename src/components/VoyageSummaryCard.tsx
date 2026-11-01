import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Pencil,
  X,
} from 'lucide-react';
import { ClimateProfile, TripDetails } from '../types';
import { CLIMATE_OPTIONS } from '../data/packingTemplates';

interface VoyageSummaryCardProps {
  trip: TripDetails;
  totalItems: number;
  packedItems: number;
  onUpdateTripDetails: (updated: {
    destination: string;
    days: number;
    climate: ClimateProfile;
    departureDate?: string;
  }) => void;
}

export const VoyageSummaryCard: React.FC<VoyageSummaryCardProps> = ({
  trip,
  totalItems,
  packedItems,
  onUpdateTripDetails,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDest, setEditDest] = useState(trip.destination);
  const [editDays, setEditDays] = useState(String(trip.days));
  const [editClimate, setEditClimate] = useState<ClimateProfile>(trip.climate);
  const [editDate, setEditDate] = useState(trip.departureDate || '');
  const [editErrors, setEditErrors] = useState<{
    destination?: string;
    days?: string;
  }>({});

  const percentage =
    totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
  const isComplete = totalItems > 0 && packedItems === totalItems;
  const remainingItems = Math.max(0, totalItems - packedItems);

  // SVG Ring geometry
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  const climateLabel =
    CLIMATE_OPTIONS.find((c) => c.value === trip.climate)?.label || 'Temperate';

  const formattedDeparture = trip.departureDate
    ? (() => {
        const [year, month, day] = trip.departureDate.split('-').map(Number);
        if (!year || !month || !day) return trip.departureDate;
        const dt = new Date(year, month - 1, day);
        return dt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      })()
    : null;

  const openEditor = () => {
    setEditDest(trip.destination);
    setEditDays(String(trip.days));
    setEditClimate(trip.climate);
    setEditDate(trip.departureDate || '');
    setEditErrors({});
    setIsEditing(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { destination?: string; days?: string } = {};
    if (!editDest.trim()) {
      errs.destination = 'Destination is required.';
    } else if (editDest.trim().length < 2) {
      errs.destination = 'Destination must be at least 2 characters.';
    }

    const parsedDays = Number(editDays);
    if (!editDays.trim() || Number.isNaN(parsedDays)) {
      errs.days = 'Enter a valid day count.';
    } else if (!Number.isInteger(parsedDays) || parsedDays < 1 || parsedDays > 365) {
      errs.days = 'Enter between 1 and 365 whole days.';
    }

    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onUpdateTripDetails({
      destination: editDest.trim(),
      days: parsedDays,
      climate: editClimate,
      departureDate: editDate || undefined,
    });
    setIsEditing(false);
  };

  return (
    <section
      id="voyage-overview"
      aria-label="Voyage Readiness Summary"
      className="bg-white border border-[#EAE6F8] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(60,47,128,0.04)]"
    >
      {!isEditing ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Destination & Unboxed Editorial Metadata */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5D3BE0] mb-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Active Voyage Manifest</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[26px] leading-[34px] sm:text-[34px] sm:leading-[42px] font-bold text-[#3C2F80] tracking-tight [text-wrap:balance]">
                {trip.destination}
              </h1>
              <button
                type="button"
                onClick={openEditor}
                aria-label="Edit destination and trip duration"
                className="min-h-[36px] px-3 py-1.5 rounded-xl border border-[#EAE6F8] text-xs font-semibold text-[#3C2F80] hover:bg-[#5D3BE0]/[0.06] transition-colors duration-150 cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Pencil className="w-3.5 h-3.5 text-[#6B619B]" />
                <span>Edit Trip</span>
              </button>
            </div>

            {/* Clean unboxed metadata with subtle · separators */}
            <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-[#6B619B]">
              <span className="font-medium text-[#3C2F80] tabular-nums">
                {trip.days} {trip.days === 1 ? 'Day' : 'Days'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{climateLabel}</span>
              {formattedDeparture && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    Departs {formattedDeparture}
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {packedItems} of {totalItems} packed
              </span>
            </div>
          </div>

          {/* Master Readiness Ring */}
          <div className="flex items-center gap-4 self-start md:self-center shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[#6B619B]">
                Master Readiness
              </p>
              <p
                className={`text-sm font-semibold mt-0.5 tabular-nums ${
                  isComplete ? 'text-[#10B981]' : 'text-[#3C2F80]'
                }`}
              >
                {totalItems === 0
                  ? 'No items yet'
                  : isComplete
                  ? 'Ready for Departure'
                  : `${remainingItems} remaining`}
              </p>
            </div>

            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg
                className="w-20 h-20 -rotate-90"
                viewBox="0 0 80 80"
                aria-hidden="true"
              >
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke="#EAE6F8"
                  strokeWidth="7"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke={isComplete ? '#10B981' : '#5D3BE0'}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 ease-out"
                />
              </svg>
              <span
                className={`absolute text-base font-bold tabular-nums ${
                  isComplete ? 'text-[#10B981]' : 'text-[#3C2F80]'
                }`}
              >
                {percentage}%
              </span>
            </div>

            <div className="sm:hidden">
              <p className="text-xs font-semibold text-[#6B619B]">
                Master Readiness
              </p>
              <p
                className={`text-sm font-semibold mt-0.5 tabular-nums ${
                  isComplete ? 'text-[#10B981]' : 'text-[#3C2F80]'
                }`}
              >
                {totalItems === 0
                  ? 'No items yet'
                  : isComplete
                  ? 'Ready for Departure'
                  : `${remainingItems} remaining`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Inline Validated Trip Editor */
        <form onSubmit={handleEditSubmit} noValidate className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#3C2F80]">
              Update Voyage Details
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              aria-label="Cancel editing trip"
              className="min-h-[40px] min-w-[40px] rounded-xl text-[#6B619B] hover:text-[#3C2F80] hover:bg-[#F8F7FC] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <label
                htmlFor="edit-destination"
                className="block text-xs font-semibold text-[#3C2F80] mb-1"
              >
                Destination <span className="text-[#BA1A1A]">*</span>
              </label>
              <input
                id="edit-destination"
                type="text"
                value={editDest}
                onChange={(e) => setEditDest(e.target.value)}
                className={`voyage-input w-full h-11 px-3.5 bg-white border rounded-xl text-sm text-[#3C2F80] ${
                  editErrors.destination ? 'border-[#BA1A1A]' : 'border-[#EAE6F8]'
                }`}
              />
              {editErrors.destination && (
                <p className="mt-1 text-xs text-[#BA1A1A] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{editErrors.destination}</span>
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="edit-days"
                className="block text-xs font-semibold text-[#3C2F80] mb-1"
              >
                Days <span className="text-[#BA1A1A]">*</span>
              </label>
              <input
                id="edit-days"
                type="number"
                min={1}
                max={365}
                value={editDays}
                onChange={(e) => setEditDays(e.target.value)}
                className={`voyage-input w-full h-11 px-3 bg-white border rounded-xl text-sm text-[#3C2F80] tabular-nums ${
                  editErrors.days ? 'border-[#BA1A1A]' : 'border-[#EAE6F8]'
                }`}
              />
              {editErrors.days && (
                <p className="mt-1 text-xs text-[#BA1A1A] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{editErrors.days}</span>
                </p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="edit-climate"
                className="block text-xs font-semibold text-[#3C2F80] mb-1"
              >
                Climate
              </label>
              <select
                id="edit-climate"
                value={editClimate}
                onChange={(e) =>
                  setEditClimate(e.target.value as ClimateProfile)
                }
                className="voyage-input w-full h-11 px-3 bg-white border border-[#EAE6F8] rounded-xl text-sm text-[#3C2F80]"
              >
                {CLIMATE_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="edit-date"
                className="block text-xs font-semibold text-[#3C2F80] mb-1"
              >
                Departure
              </label>
              <input
                id="edit-date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="voyage-input w-full h-11 px-2.5 bg-white border border-[#EAE6F8] rounded-xl text-sm text-[#3C2F80] tabular-nums"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#EAE6F8] text-sm font-semibold text-[#3C2F80] hover:bg-[#5D3BE0]/[0.06] cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#5D3BE0] hover:bg-[#9E5AFD] text-sm font-semibold text-white cursor-pointer whitespace-nowrap transition-colors duration-150"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Continuous Packing Capacity / Progress Bar */}
      <div className="mt-6 pt-5 border-t border-[#EAE6F8]">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-[#3C2F80]">Packing Progress</span>
          <span
            className={`tabular-nums ${
              isComplete ? 'text-[#10B981]' : 'text-[#5D3BE0]'
            }`}
          >
            {packedItems} / {totalItems} items ({percentage}%)
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall packing completion"
          className="w-full h-3.5 rounded-full bg-[#EAE6F8] overflow-hidden"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5D3BE0] via-[#9E5AFD] to-[#10B981] transition-transform duration-200 ease-out origin-left"
            style={{ transform: `scaleX(${percentage / 100})` }}
          />
        </div>

        {isComplete && (
          <div className="mt-4 px-4 py-3 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/25 flex items-center gap-2.5 text-sm font-semibold text-[#005236]">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>
              100% Packed — Your luggage is complete and ready for{' '}
              {trip.destination}.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
