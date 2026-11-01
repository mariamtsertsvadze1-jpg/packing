/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCheck, PackageOpen, RotateCcw, Search, X } from 'lucide-react';
import {
  CategoryName,
  ClimateProfile,
  FilterStatus,
  PackingItem,
  PersistedVoyageState,
  TripDetails,
} from './types';
import {
  ALL_CATEGORIES,
  generateStarterManifest,
} from './data/packingTemplates';
import { VoyageSetupForm } from './components/VoyageSetupForm';
import { VoyageSummaryCard } from './components/VoyageSummaryCard';
import { AddCustomItemBar } from './components/AddCustomItemBar';
import { CategoryCard } from './components/CategoryCard';
import { ResetTripModal } from './components/ResetTripModal';

const STORAGE_KEY = 'earth_voyage_packing_state_v1';

function loadInitialState(): PersistedVoyageState {
  if (typeof window === 'undefined') {
    return { trip: null, items: [] };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { trip: null, items: [] };
    const parsed = JSON.parse(raw) as Partial<PersistedVoyageState>;

    if (
      parsed &&
      parsed.trip &&
      typeof parsed.trip.destination === 'string' &&
      parsed.trip.destination.trim().length > 0 &&
      typeof parsed.trip.days === 'number' &&
      parsed.trip.days >= 1 &&
      Array.isArray(parsed.items)
    ) {
      const validItems: PackingItem[] = parsed.items.filter(
        (item): item is PackingItem =>
          Boolean(
            item &&
              typeof item.id === 'string' &&
              typeof item.name === 'string' &&
              typeof item.category === 'string' &&
              typeof item.quantity === 'number' &&
              typeof item.packed === 'boolean'
          )
      );
      return {
        trip: parsed.trip,
        items: validItems,
      };
    }
  } catch {
    // Gracefully fallback if localStorage is unavailable or malformed
  }
  return { trip: null, items: [] };
}

export default function App() {
  const [voyageState, setVoyageState] =
    useState<PersistedVoyageState>(loadInitialState);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>(
    FilterStatus.All
  );
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryName | 'All'
  >('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const { trip, items } = voyageState;

  // Persist trip and checklist check states to localStorage automatically
  useEffect(() => {
    try {
      if (!trip) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ trip, items })
        );
      }
    } catch {
      // Ignore storage quota errors safely
    }
  }, [trip, items]);

  const handleCreateTrip = useCallback((newTrip: TripDetails) => {
    const starterItems = generateStarterManifest(newTrip.days, newTrip.climate);
    setVoyageState({
      trip: newTrip,
      items: starterItems,
    });
    setStatusFilter(FilterStatus.All);
    setSelectedCategory('All');
    setSearchQuery('');
  }, []);

  const handleLoadQuickSample = useCallback(() => {
    handleCreateTrip({
      destination: 'Kyoto, Japan',
      days: 7,
      climate: ClimateProfile.Temperate,
      createdAt: new Date().toISOString(),
    });
  }, [handleCreateTrip]);

  const handleUpdateTripDetails = useCallback(
    (updated: {
      destination: string;
      days: number;
      climate: ClimateProfile;
      departureDate?: string;
    }) => {
      setVoyageState((prev) => {
        if (!prev.trip) return prev;
        return {
          ...prev,
          trip: {
            ...prev.trip,
            destination: updated.destination,
            days: updated.days,
            climate: updated.climate,
            departureDate: updated.departureDate,
          },
        };
      });
    },
    []
  );

  const handleToggleItem = useCallback((itemId: string) => {
    setVoyageState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      ),
    }));
  }, []);

  const handleAddItem = useCallback(
    (newItemData: {
      name: string;
      category: CategoryName;
      quantity: number;
      note?: string;
    }) => {
      const createdItem: PackingItem = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: newItemData.name,
        category: newItemData.category,
        quantity: newItemData.quantity,
        note: newItemData.note,
        packed: false,
        isCustom: true,
      };

      setVoyageState((prev) => ({
        ...prev,
        items: [...prev.items, createdItem],
      }));

      // Ensure filters don't hide the newly added item
      if (statusFilter === FilterStatus.Packed) {
        setStatusFilter(FilterStatus.All);
      }
      if (
        selectedCategory !== 'All' &&
        selectedCategory !== newItemData.category
      ) {
        setSelectedCategory('All');
      }
      if (searchQuery.trim()) {
        setSearchQuery('');
      }
    },
    [statusFilter, selectedCategory, searchQuery]
  );

  const handleQuickAddInCategory = useCallback(
    (name: string, category: CategoryName) => {
      handleAddItem({ name, category, quantity: 1 });
    },
    [handleAddItem]
  );

  const handleDeleteItem = useCallback((itemId: string) => {
    setVoyageState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  }, []);

  const handleUncheckAll = useCallback(() => {
    setVoyageState((prev) => ({
      ...prev,
      items: prev.items.map((item) => ({ ...item, packed: false })),
    }));
  }, []);

  const handleCheckAll = useCallback(() => {
    setVoyageState((prev) => ({
      ...prev,
      items: prev.items.map((item) => ({ ...item, packed: true })),
    }));
  }, []);

  const handleStartNewTrip = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage access errors
    }
    setVoyageState({ trip: null, items: [] });
    setStatusFilter(FilterStatus.All);
    setSelectedCategory('All');
    setSearchQuery('');
  }, []);

  const handleRestoreDefaults = useCallback(() => {
    if (!trip) return;
    const restored = generateStarterManifest(trip.days, trip.climate);
    setVoyageState((prev) => ({
      ...prev,
      items: restored,
    }));
    setStatusFilter(FilterStatus.All);
    setSelectedCategory('All');
    setSearchQuery('');
  }, [trip]);

  // Derived real-time counts
  const totalItems = items.length;
  const packedItems = useMemo(
    () => items.filter((i) => i.packed).length,
    [items]
  );
  const remainingItems = totalItems - packedItems;

  // Categories that currently contain at least one item in the manifest
  const populatedCategories = useMemo(() => {
    const present = new Set(items.map((i) => i.category));
    return ALL_CATEGORIES.filter((cat) => present.has(cat));
  }, [items]);

  // Per-category unfiltered totals (so progress chips always reflect true category progress)
  const categoryStats = useMemo(() => {
    const stats = new Map<CategoryName, { total: number; packed: number }>();
    for (const cat of ALL_CATEGORIES) {
      stats.set(cat, { total: 0, packed: 0 });
    }
    for (const item of items) {
      const current = stats.get(item.category) || { total: 0, packed: 0 };
      current.total += 1;
      if (item.packed) current.packed += 1;
      stats.set(item.category, current);
    }
    return stats;
  }, [items]);

  // Filtered items grouped by category
  const filteredCategoryGroups = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const matching = items.filter((item) => {
      if (statusFilter === FilterStatus.Remaining && item.packed) return false;
      if (statusFilter === FilterStatus.Packed && !item.packed) return false;
      if (selectedCategory !== 'All' && item.category !== selectedCategory)
        return false;
      if (
        normalizedSearch &&
        !item.name.toLowerCase().includes(normalizedSearch) &&
        !(item.note && item.note.toLowerCase().includes(normalizedSearch))
      ) {
        return false;
      }
      return true;
    });

    return ALL_CATEGORIES.map((category) => ({
      category,
      items: matching.filter((i) => i.category === category),
    })).filter((group) => group.items.length > 0);
  }, [items, statusFilter, selectedCategory, searchQuery]);

  const hasActiveFilters =
    statusFilter !== FilterStatus.All ||
    selectedCategory !== 'All' ||
    searchQuery.trim().length > 0;

  const clearAllFilters = () => {
    setStatusFilter(FilterStatus.All);
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7FC] text-[#3C2F80]">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-[#EAE6F8]">
        <div className="max-w-[1200px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-[#3C2F80] whitespace-nowrap shrink-0"
          >
            Earth Voyage
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          {trip ? (
            <nav
              aria-label="Primary sections"
              className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6B619B]"
            >
              <a
                href="#voyage-overview"
                className="hover:text-[#3C2F80] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Overview
              </a>
              <a
                href="#add-custom-item"
                className="hover:text-[#3C2F80] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Add Item
              </a>
              <a
                href="#packing-checklist"
                className="hover:text-[#3C2F80] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Checklist
              </a>
            </nav>
          ) : (
            <nav
              aria-label="Setup sections"
              className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6B619B]"
            >
              <a
                href="#manifest-setup"
                className="hover:text-[#3C2F80] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Trip Details
              </a>
              <a
                href="#manifest-preview"
                className="hover:text-[#3C2F80] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Manifest Preview
              </a>
            </nav>
          )}

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            {trip ? (
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="min-h-[40px] px-4 py-2 rounded-xl border border-[#EAE6F8] text-xs sm:text-sm font-semibold text-[#3C2F80] hover:bg-[#5D3BE0]/[0.06] hover:border-[#5D3BE0]/40 transition-colors duration-150 cursor-pointer inline-flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#5D3BE0] shrink-0" />
                <span>Reset / New Trip</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLoadQuickSample}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#5D3BE0] hover:bg-[#9E5AFD] text-xs sm:text-sm font-semibold text-white transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
              >
                Try Sample Trip
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main
        id="top"
        className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-16"
      >
        {!trip ? (
          <VoyageSetupForm onCreateTrip={handleCreateTrip} />
        ) : (
          <div className="pt-6 sm:pt-8 space-y-6 sm:space-y-8">
            {/* 1. Voyage Summary & Real-Time Capacity Progress Bar */}
            <VoyageSummaryCard
              trip={trip}
              totalItems={totalItems}
              packedItems={packedItems}
              onUpdateTripDetails={handleUpdateTripDetails}
            />

            {/* 2. Add Custom Item Bar */}
            <AddCustomItemBar onAddItem={handleAddItem} />

            {/* 3. Filter, Search & Bulk Readiness Toolbar */}
            <section
              id="packing-checklist"
              aria-label="Packing Checklist Controls"
              className="space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Status Segmented Filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    role="group"
                    aria-label="Filter items by packing status"
                    className="inline-flex items-center p-1 rounded-xl bg-white border border-[#EAE6F8]"
                  >
                    <button
                      type="button"
                      onClick={() => setStatusFilter(FilterStatus.All)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums ${
                        statusFilter === FilterStatus.All
                          ? 'bg-[#5D3BE0] text-white'
                          : 'text-[#6B619B] hover:text-[#3C2F80]'
                      }`}
                    >
                      All ({totalItems})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter(FilterStatus.Remaining)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums ${
                        statusFilter === FilterStatus.Remaining
                          ? 'bg-[#5D3BE0] text-white'
                          : 'text-[#6B619B] hover:text-[#3C2F80]'
                      }`}
                    >
                      Remaining ({remainingItems})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter(FilterStatus.Packed)}
                      className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums ${
                        statusFilter === FilterStatus.Packed
                          ? 'bg-[#5D3BE0] text-white'
                          : 'text-[#6B619B] hover:text-[#3C2F80]'
                      }`}
                    >
                      Packed ({packedItems})
                    </button>
                  </div>

                  {/* Quick Pack All / Uncheck All toggle */}
                  {totalItems > 0 && (
                    <button
                      type="button"
                      onClick={
                        packedItems === totalItems
                          ? handleUncheckAll
                          : handleCheckAll
                      }
                      className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[#EAE6F8] bg-white text-xs font-semibold text-[#3C2F80] hover:bg-[#5D3BE0]/[0.06] transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-[#5D3BE0] shrink-0" />
                      <span>
                        {packedItems === totalItems
                          ? 'Uncheck All'
                          : 'Mark All Packed'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Search Input */}
                <div className="relative w-full lg:w-72">
                  <Search className="w-4 h-4 text-[#6B619B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter items..."
                    aria-label="Filter checklist items by name"
                    className="voyage-input w-full h-11 pl-10 pr-9 bg-white border border-[#EAE6F8] rounded-xl text-sm text-[#3C2F80] placeholder:text-[#6B619B]/60"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search query"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg text-[#6B619B] hover:text-[#3C2F80] flex items-center justify-center cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Bar */}
              {populatedCategories.length > 1 && (
                <div
                  role="group"
                  aria-label="Filter by category"
                  className="flex items-center gap-2 overflow-x-auto pb-1"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('All')}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                      selectedCategory === 'All'
                        ? 'bg-[#3C2F80] text-white border-[#3C2F80]'
                        : 'bg-white text-[#6B619B] border-[#EAE6F8] hover:text-[#3C2F80]'
                    }`}
                  >
                    All Categories
                  </button>
                  {populatedCategories.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                          active
                            ? 'bg-[#3C2F80] text-white border-[#3C2F80]'
                            : 'bg-white text-[#6B619B] border-[#EAE6F8] hover:text-[#3C2F80]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 4. Category Checklist Cards Grid or Empty States */}
              {totalItems === 0 ? (
                <div className="bg-white border border-[#EAE6F8] rounded-3xl p-10 text-center shadow-[0_4px_20px_-2px_rgba(60,47,128,0.04)]">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F7FC] border border-[#EAE6F8] flex items-center justify-center text-[#5D3BE0] mx-auto mb-4">
                    <PackageOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#3C2F80]">
                    Your packing manifest is empty
                  </h2>
                  <p className="mt-1.5 text-sm text-[#6B619B] max-w-md mx-auto">
                    Add custom items above or restore the recommended starter
                    list scaled for {trip.days}{' '}
                    {trip.days === 1 ? 'day' : 'days'} in {trip.destination}.
                  </p>
                  <button
                    type="button"
                    onClick={handleRestoreDefaults}
                    className="mt-5 min-h-[48px] px-6 py-3 rounded-2xl bg-[#5D3BE0] hover:bg-[#9E5AFD] text-sm font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Restore Recommended Essentials
                  </button>
                </div>
              ) : filteredCategoryGroups.length === 0 ? (
                <div className="bg-white border border-[#EAE6F8] rounded-3xl p-10 text-center shadow-[0_4px_20px_-2px_rgba(60,47,128,0.04)]">
                  <h2 className="text-lg font-semibold text-[#3C2F80]">
                    No matching items found
                  </h2>
                  <p className="mt-1.5 text-sm text-[#6B619B]">
                    {statusFilter === FilterStatus.Remaining &&
                    remainingItems === 0
                      ? 'Every item on your manifest is already packed!'
                      : 'Try adjusting your active status filter, category filter, or search term.'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl border border-[#EAE6F8] text-sm font-semibold text-[#3C2F80] hover:bg-[#5D3BE0]/[0.06] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Show All Items
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 items-start">
                  {filteredCategoryGroups.map((group) => {
                    const stats = categoryStats.get(group.category) || {
                      total: group.items.length,
                      packed: 0,
                    };
                    return (
                      <CategoryCard
                        key={group.category}
                        category={group.category}
                        items={group.items}
                        totalCategoryCount={stats.total}
                        packedCategoryCount={stats.packed}
                        onToggleItem={handleToggleItem}
                        onDeleteItem={handleDeleteItem}
                        onQuickAddInCategory={handleQuickAddInCategory}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-[#EAE6F8] bg-white/70 py-6">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B619B]">
          <span>
            Earth Voyage — Personal Travel Packing &amp; Readiness Manifest
          </span>
          <div className="flex items-center gap-4">
            <span>Saved locally in your browser</span>
            {trip && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(true)}
                  className="font-semibold text-[#5D3BE0] hover:text-[#9E5AFD] transition-colors cursor-pointer"
                >
                  Reset / New Trip
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Accessible Reset / New Trip Confirmation Dialog */}
      {trip && (
        <ResetTripModal
          isOpen={isResetModalOpen}
          destination={trip.destination}
          packedCount={packedItems}
          onClose={() => setIsResetModalOpen(false)}
          onUncheckAll={handleUncheckAll}
          onStartNewTrip={handleStartNewTrip}
        />
      )}
    </div>
  );
}
