import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Calendar,
  Check,
  Compass,
  FileText,
  MapPin,
  Palmtree,
  Snowflake,
  Sun,
} from 'lucide-react';
import { ClimateProfile, TripDetails } from '../types';
import {
  CLIMATE_OPTIONS,
  DESTINATION_PRESETS,
  generateStarterManifest,
} from '../data/packingTemplates';

interface VoyageSetupFormProps {
  onCreateTrip: (trip: TripDetails) => void;
}

export const VoyageSetupForm: React.FC<VoyageSetupFormProps> = ({
  onCreateTrip,
}) => {
  const [destination, setDestination] = useState('');
  const [daysInput, setDaysInput] = useState('5');
  const [climate, setClimate] = useState<ClimateProfile>(
    ClimateProfile.Temperate
  );
  const [departureDate, setDepartureDate] = useState('');
  const [errors, setErrors] = useState<{
    destination?: string;
    days?: string;
  }>({});
  const [touched, setTouched] = useState<{
    destination?: boolean;
    days?: boolean;
  }>({});

  const validateFields = (destVal: string, daysVal: string) => {
    const nextErrors: { destination?: string; days?: string } = {};
    const trimmedDest = destVal.trim();

    if (!trimmedDest) {
      nextErrors.destination = 'Please enter a destination for your trip.';
    } else if (trimmedDest.length < 2) {
      nextErrors.destination = 'Destination must be at least 2 characters.';
    }

    const parsedDays = Number(daysVal);
    if (!daysVal.trim() || Number.isNaN(parsedDays)) {
      nextErrors.days = 'Please enter the number of days.';
    } else if (!Number.isInteger(parsedDays) || parsedDays < 1) {
      nextErrors.days = 'Duration must be a whole number of at least 1 day.';
    } else if (parsedDays > 365) {
      nextErrors.days = 'Duration must be between 1 and 365 days.';
    }

    return nextErrors;
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    if (touched.destination) {
      const next = validateFields(value, daysInput);
      setErrors((prev) => ({ ...prev, destination: next.destination }));
    }
  };

  const handleDaysChange = (value: string) => {
    setDaysInput(value);
    if (touched.days) {
      const next = validateFields(destination, value);
      setErrors((prev) => ({ ...prev, days: next.days }));
    }
  };

  const handleApplyPreset = (
    presetDest: string,
    presetDays: number,
    presetClimate: ClimateProfile
  ) => {
    setDestination(presetDest);
    setDaysInput(String(presetDays));
    setClimate(presetClimate);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ destination: true, days: true });
    const validationErrors = validateFields(destination, daysInput);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onCreateTrip({
      destination: destination.trim(),
      days: Number(daysInput),
      climate,
      departureDate: departureDate || undefined,
      createdAt: new Date().toISOString(),
    });
  };

  // Live preview of the manifest quantities scaled to current days & climate
  const previewSummary = useMemo(() => {
    const parsed = Number(daysInput);
    const validDays =
      !Number.isNaN(parsed) && parsed >= 1 && parsed <= 365
        ? Math.round(parsed)
        : 5;
    const sampleItems = generateStarterManifest(validDays, climate);
    const totalUnits = sampleItems.reduce((acc, i) => acc + i.quantity, 0);
    const byCategory = sampleItems.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    return {
      validDays,
      distinctItems: sampleItems.length,
      totalUnits,
      categories: Object.entries(byCategory),
    };
  }, [daysInput, climate]);

  const getClimateIcon = (profile: ClimateProfile) => {
    switch (profile) {
      case ClimateProfile.Temperate:
        return <Sun className="w-4 h-4 shrink-0" />;
      case ClimateProfile.Tropical:
        return <Palmtree className="w-4 h-4 shrink-0" />;
      case ClimateProfile.Cold:
        return <Snowflake className="w-4 h-4 shrink-0" />;
      case ClimateProfile.Business:
        return <Briefcase className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <section
      id="manifest-setup"
      aria-labelledby="setup-heading"
      className="py-6 sm:py-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left 7 Columns: Primary Trip Setup Form */}
        <div className="lg:col-span-7 bg-white border border-[#EAE6F8] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_-2px_rgba(60,47,128,0.04)] flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5D3BE0] tracking-wide mb-2">
              Departure Preparation
            </p>
            <h1
              id="setup-heading"
              className="text-[30px] leading-[38px] sm:text-[40px] sm:leading-[48px] font-bold text-[#3C2F80] tracking-tight [text-wrap:balance]"
            >
              Prepare your packing manifest with calm precision.
            </h1>
            <p className="mt-3 text-base text-[#6B619B] leading-relaxed max-w-xl">
              Enter your destination and trip duration to generate a structured,
              category-organized packing checklist that saves automatically as
              you pack.
            </p>

            {/* Quick-Fill Itinerary Presets */}
            <div className="mt-6">
              <span className="block text-xs font-semibold text-[#6B619B] mb-2.5">
                Quick-fill sample itineraries
              </span>
              <div className="flex flex-wrap gap-2">
                {DESTINATION_PRESETS.map((preset) => {
                  const isSelected =
                    destination === preset.destination &&
                    Number(daysInput) === preset.days &&
                    climate === preset.climate;
                  return (
                    <button
                      key={preset.destination}
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          preset.destination,
                          preset.days,
                          preset.climate
                        )
                      }
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 border ${
                        isSelected
                          ? 'bg-[#5D3BE0] text-white border-[#5D3BE0]'
                          : 'bg-[#F8F7FC] text-[#3C2F80] border-[#EAE6F8] hover:bg-[#5D3BE0]/[0.06] hover:border-[#5D3BE0]/40'
                      }`}
                    >
                      {preset.destination} ·{' '}
                      <span className="tabular-nums">{preset.days}d</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-7 space-y-5"
            >
              {/* Destination & Days Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label
                    htmlFor="trip-destination"
                    className="block text-sm font-semibold text-[#3C2F80] mb-1.5"
                  >
                    Destination <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#6B619B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="trip-destination"
                      name="destination"
                      type="text"
                      value={destination}
                      onChange={(e) => handleDestinationChange(e.target.value)}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, destination: true }));
                        const next = validateFields(destination, daysInput);
                        setErrors((prev) => ({
                          ...prev,
                          destination: next.destination,
                        }));
                      }}
                      placeholder="e.g., Kyoto, Japan or Lisbon"
                      aria-invalid={Boolean(errors.destination)}
                      aria-describedby={
                        errors.destination ? 'destination-error' : undefined
                      }
                      className={`voyage-input w-full h-12 pl-10 pr-4 bg-white border rounded-xl text-base text-[#3C2F80] placeholder:text-[#6B619B]/60 transition-shadow ${
                        errors.destination
                          ? 'border-[#BA1A1A]'
                          : 'border-[#EAE6F8]'
                      }`}
                    />
                  </div>
                  {errors.destination && (
                    <p
                      id="destination-error"
                      role="alert"
                      className="mt-1.5 text-xs font-medium text-[#BA1A1A] flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.destination}</span>
                    </p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="trip-days"
                    className="block text-sm font-semibold text-[#3C2F80] mb-1.5"
                  >
                    Duration (Days) <span className="text-[#BA1A1A]">*</span>
                  </label>
                  <input
                    id="trip-days"
                    name="days"
                    type="number"
                    min={1}
                    max={365}
                    step={1}
                    inputMode="numeric"
                    value={daysInput}
                    onChange={(e) => handleDaysChange(e.target.value)}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, days: true }));
                      const next = validateFields(destination, daysInput);
                      setErrors((prev) => ({ ...prev, days: next.days }));
                    }}
                    placeholder="7"
                    aria-invalid={Boolean(errors.days)}
                    aria-describedby={errors.days ? 'days-error' : undefined}
                    className={`voyage-input w-full h-12 px-4 bg-white border rounded-xl text-base text-[#3C2F80] tabular-nums placeholder:text-[#6B619B]/60 transition-shadow ${
                      errors.days ? 'border-[#BA1A1A]' : 'border-[#EAE6F8]'
                    }`}
                  />
                  {errors.days && (
                    <p
                      id="days-error"
                      role="alert"
                      className="mt-1.5 text-xs font-medium text-[#BA1A1A] flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.days}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Climate Selector */}
              <div>
                <span className="block text-sm font-semibold text-[#3C2F80] mb-2">
                  Climate &amp; Trip Style
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CLIMATE_OPTIONS.map((opt) => {
                    const active = climate === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setClimate(opt.value)}
                        aria-pressed={active}
                        className={`min-h-[48px] px-3 py-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center gap-2 ${
                          active
                            ? 'bg-[#5D3BE0]/[0.07] border-[#5D3BE0] text-[#3C2F80]'
                            : 'bg-white border-[#EAE6F8] text-[#6B619B] hover:border-[#9E5AFD]/60 hover:text-[#3C2F80]'
                        }`}
                      >
                        <span
                          className={
                            active ? 'text-[#5D3BE0]' : 'text-[#6B619B]'
                          }
                        >
                          {getClimateIcon(opt.value)}
                        </span>
                        <span className="text-xs font-semibold whitespace-nowrap truncate">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Departure Date */}
              <div className="max-w-xs">
                <label
                  htmlFor="departure-date"
                  className="block text-sm font-semibold text-[#3C2F80] mb-1.5"
                >
                  Departure Date{' '}
                  <span className="font-normal text-xs text-[#6B619B]">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#6B619B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="departure-date"
                    name="departureDate"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="voyage-input w-full h-11 pl-10 pr-3.5 bg-white border border-[#EAE6F8] rounded-xl text-sm text-[#3C2F80] tabular-nums"
                  />
                </div>
              </div>

              {/* Primary Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[48px] px-7 py-3 bg-[#5D3BE0] hover:bg-[#9E5AFD] active:scale-[0.99] text-white font-semibold text-base rounded-2xl shadow-[0_12px_32px_-4px_rgba(93,59,224,0.24)] transition-all duration-150 cursor-pointer inline-flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0"
                >
                  <span>Build Packing Manifest</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 5 Columns: Live Boarding Manifest Preview */}
        <aside
          id="manifest-preview"
          aria-label="Packing Manifest Preview"
          className="lg:col-span-5 bg-white border border-[#EAE6F8] rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(60,47,128,0.04)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#EAE6F8]">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#6B619B]">
                  Live Manifest Estimate
                </p>
                <h2 className="text-[22px] leading-[28px] font-semibold text-[#3C2F80] truncate mt-0.5">
                  {destination.trim() || 'Your Next Destination'}
                </h2>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#F8F7FC] border border-[#EAE6F8] flex items-center justify-center text-[#5D3BE0] shrink-0">
                <Compass className="w-5 h-5" />
              </div>
            </div>

            {/* Key Quantitative Summary */}
            <div className="grid grid-cols-2 gap-4 py-5 border-b border-[#EAE6F8]">
              <div>
                <p className="text-xs text-[#6B619B]">Checklist Lines</p>
                <p className="text-2xl font-bold text-[#3C2F80] tabular-nums mt-0.5">
                  {previewSummary.distinctItems}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B619B]">Scaled Item Count</p>
                <p className="text-2xl font-bold text-[#5D3BE0] tabular-nums mt-0.5">
                  {previewSummary.totalUnits}
                </p>
              </div>
            </div>

            {/* Included Categories Breakdown */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#6B619B] mb-3">
                <span>Tailored Categories</span>
                <span className="tabular-nums">
                  {previewSummary.validDays}{' '}
                  {previewSummary.validDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <ul className="space-y-2.5">
                {previewSummary.categories.map(([catName, count]) => (
                  <li
                    key={catName}
                    className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#F8F7FC] text-sm"
                  >
                    <span className="font-medium text-[#3C2F80] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#9E5AFD] shrink-0" />
                      <span>{catName}</span>
                    </span>
                    <span className="text-xs font-semibold text-[#6B619B] tabular-nums">
                      {count} items
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#EAE6F8] space-y-2 text-xs text-[#6B619B]">
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>
                Real-time progress meter updates as each item is packed
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>
                Add custom gear or remove items anytime during preparation
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>
                Automatically saved in your browser across page reloads
              </span>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};
