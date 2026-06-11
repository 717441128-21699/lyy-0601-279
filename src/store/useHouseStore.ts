import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  House,
  SortField,
  SortOrder,
  Weights,
  FilterConditions,
  FilterPreset,
} from "@/types";
import { DEFAULT_WEIGHTS, DEFAULT_FILTERS } from "@/types";

interface RatingBreakdown {
  safety: number;
  valueForMoney: number;
  convenience: number;
  comfort: number;
}

interface CostBreakdown {
  firstMonthCash: number;
  monthlyRealCost: number;
  agencyFeeMonthly: number;
}

interface HouseStore {
  houses: House[];
  selectedHouseId: string | null;
  sortField: SortField;
  sortOrder: SortOrder;
  weights: Weights;
  filters: FilterConditions;
  filterPresets: FilterPreset[];
  addHouse: (house: Omit<House, "id" | "createdAt" | "updatedAt">) => void;
  updateHouse: (id: string, updates: Partial<House>) => void;
  deleteHouse: (id: string) => void;
  setSelectedHouse: (id: string | null) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSort: (field: SortField) => void;
  setWeights: (weights: Partial<Weights>) => void;
  resetWeights: () => void;
  setFilters: (filters: Partial<FilterConditions>) => void;
  resetFilters: () => void;
  addFilterPreset: (name: string) => void;
  applyFilterPreset: (id: string) => void;
  deleteFilterPreset: (id: string) => void;
  importData: (data: {
    houses: House[];
    weights?: Weights;
    filters?: FilterConditions;
    filterPresets?: FilterPreset[];
  }) => boolean;
  exportData: () => string;
  getFilteredHouses: () => House[];
  getSortedHouses: () => House[];
  getCandidateHouses: () => House[];
  getTotalRating: (house: House) => number;
  getRatingBreakdown: (house: House) => RatingBreakdown;
  getCostBreakdown: (house: House) => CostBreakdown;
  hasActiveFilters: () => boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const levelToValue = (level: string): number => {
  const map: Record<string, number> = {
    优秀: 5,
    良好: 4,
    一般: 3,
    较差: 2,
    很差: 1,
  };
  return map[level] || 3;
};

const DEFAULT_HOUSE_PATCH: Partial<House> = {
  agencyFee: 0,
  movingFee: 0,
  commuteCostMonthly: 0,
  utilityEstimate: 0,
  viewingDate: "",
  contactName: "",
  contactPhone: "",
  viewingNotes: "",
  eliminateReason: "",
  shortlistReason: "",
};

const normalizeHouse = (h: Partial<House>): House => ({
  ...(DEFAULT_HOUSE_PATCH as House),
  ...h,
  id: h.id || generateId(),
  status: h.status || "pending",
  createdAt: h.createdAt || new Date().toISOString(),
  updatedAt: h.updatedAt || new Date().toISOString(),
  ratings: h.ratings || { safety: 3, valueForMoney: 3, convenience: 3, comfort: 3 },
  mapNotes: h.mapNotes || [],
});

export const useHouseStore = create<HouseStore>()(
  persist(
    (set, get) => ({
      houses: [],
      selectedHouseId: null,
      sortField: "totalCost",
      sortOrder: "asc",
      weights: DEFAULT_WEIGHTS,
      filters: DEFAULT_FILTERS,
      filterPresets: [],

      addHouse: (houseData) => {
        const now = new Date().toISOString();
        const newHouse: House = normalizeHouse({
          ...houseData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        });
        set((state) => ({
          houses: [...state.houses, newHouse],
          selectedHouseId: state.selectedHouseId || newHouse.id,
        }));
      },

      updateHouse: (id, updates) => {
        set((state) => ({
          houses: state.houses.map((house) =>
            house.id === id
              ? { ...house, ...updates, updatedAt: new Date().toISOString() }
              : house
          ),
        }));
      },

      deleteHouse: (id) => {
        set((state) => {
          const newHouses = state.houses.filter((h) => h.id !== id);
          const newSelectedId =
            state.selectedHouseId === id
              ? newHouses.length > 0
                ? newHouses[0].id
                : null
              : state.selectedHouseId;
          return { houses: newHouses, selectedHouseId: newSelectedId };
        });
      },

      setSelectedHouse: (id) => set({ selectedHouseId: id }),

      setSortField: (field) => set({ sortField: field }),

      setSortOrder: (order) => set({ sortOrder: order }),

      toggleSort: (field) => {
        set((state) => {
          if (state.sortField === field) {
            return { sortOrder: state.sortOrder === "asc" ? "desc" : "asc" };
          }
          return { sortField: field, sortOrder: "asc" };
        });
      },

      setWeights: (weights) => {
        set((state) => {
          const newWeights = { ...state.weights, ...weights };
          const total =
            newWeights.safety +
            newWeights.valueForMoney +
            newWeights.convenience +
            newWeights.comfort;
          if (total > 0) {
            return { weights: newWeights };
          }
          return state;
        });
      },

      resetWeights: () => set({ weights: DEFAULT_WEIGHTS }),

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      addFilterPreset: (name) => {
        const preset: FilterPreset = {
          id: generateId(),
          name,
          filters: { ...get().filters },
        };
        set((state) => ({
          filterPresets: [...state.filterPresets, preset],
        }));
      },

      applyFilterPreset: (id) => {
        const preset = get().filterPresets.find((p) => p.id === id);
        if (preset) {
          set({ filters: { ...preset.filters } });
        }
      },

      deleteFilterPreset: (id) => {
        set((state) => ({
          filterPresets: state.filterPresets.filter((p) => p.id !== id),
        }));
      },

      importData: (data) => {
        try {
          if (!data.houses || !Array.isArray(data.houses)) {
            return false;
          }
          const validHouses = data.houses.map((h) => normalizeHouse(h));
          const patch: Partial<HouseStore> = {
            houses: validHouses,
          };
          if (data.weights) {
            patch.weights = { ...DEFAULT_WEIGHTS, ...data.weights };
          }
          if (data.filters) {
            patch.filters = { ...DEFAULT_FILTERS, ...data.filters };
          }
          if (data.filterPresets && Array.isArray(data.filterPresets)) {
            patch.filterPresets = data.filterPresets;
          }
          if (validHouses.length > 0) {
            patch.selectedHouseId = validHouses[0].id;
          }
          set(patch);
          return true;
        } catch {
          return false;
        }
      },

      exportData: () => {
        const { houses, weights, filters, filterPresets } = get();
        const data = {
          version: 3,
          exportedAt: new Date().toISOString(),
          houses,
          weights,
          filters,
          filterPresets,
        };
        return JSON.stringify(data, null, 2);
      },

      getTotalRating: (house) => {
        const { safety, valueForMoney, convenience, comfort } = house.ratings;
        const weights = get().weights;
        const totalWeight =
          weights.safety +
          weights.valueForMoney +
          weights.convenience +
          weights.comfort;
        if (totalWeight === 0) return 0;
        const weightedSum =
          safety * (weights.safety / totalWeight) * 5 +
          valueForMoney * (weights.valueForMoney / totalWeight) * 5 +
          convenience * (weights.convenience / totalWeight) * 5 +
          comfort * (weights.comfort / totalWeight) * 5;
        return weightedSum / 5;
      },

      getRatingBreakdown: (house) => {
        const { safety, valueForMoney, convenience, comfort } = house.ratings;
        const weights = get().weights;
        const totalWeight =
          weights.safety +
          weights.valueForMoney +
          weights.convenience +
          weights.comfort;
        if (totalWeight === 0) {
          return { safety: 0, valueForMoney: 0, convenience: 0, comfort: 0 };
        }
        return {
          safety: safety * (weights.safety / totalWeight),
          valueForMoney: valueForMoney * (weights.valueForMoney / totalWeight),
          convenience: convenience * (weights.convenience / totalWeight),
          comfort: comfort * (weights.comfort / totalWeight),
        };
      },

      getCostBreakdown: (house) => {
        const rent = house.rent || 0;
        const deposit = house.deposit || 0;
        const agencyFee = house.agencyFee || 0;
        const movingFee = house.movingFee || 0;
        const commuteCost = house.commuteCostMonthly || 0;
        const utility = house.utilityEstimate || 0;

        const firstMonthCash = rent + deposit + agencyFee + movingFee;
        const agencyFeeMonthly = agencyFee / 12;
        const monthlyRealCost =
          rent + deposit / 12 + agencyFeeMonthly + commuteCost + utility;

        return { firstMonthCash, monthlyRealCost, agencyFeeMonthly };
      },

      hasActiveFilters: () => {
        const f = get().filters;
        return (
          f.rentMin !== null ||
          f.rentMax !== null ||
          f.commuteMax !== null ||
          f.roomType !== "" ||
          f.moveInDateBefore !== "" ||
          f.status !== ""
        );
      },

      getFilteredHouses: () => {
        const { houses, filters } = get();
        return houses.filter((house) => {
          const h = normalizeHouse(house);
          if (filters.rentMin !== null && h.rent < filters.rentMin) return false;
          if (filters.rentMax !== null && h.rent > filters.rentMax) return false;
          if (filters.commuteMax !== null && h.commuteTime > filters.commuteMax)
            return false;
          if (filters.roomType && h.roomType !== filters.roomType) return false;
          if (filters.moveInDateBefore) {
            if (!h.moveInDate) return false;
            if (new Date(h.moveInDate) > new Date(filters.moveInDateBefore))
              return false;
          }
          if (filters.status && h.status !== filters.status) return false;
          return true;
        });
      },

      getSortedHouses: () => {
        const { sortField, sortOrder, getFilteredHouses, getTotalRating, getCostBreakdown } =
          get();
        const sorted = [...getFilteredHouses()];

        const getValue = (house: House): number => {
          switch (sortField) {
            case "totalCost":
              return getCostBreakdown(house).monthlyRealCost;
            case "commuteTime":
              return house.commuteTime;
            case "lighting":
              return levelToValue(house.lighting);
            case "noise":
              return levelToValue(house.noise);
            case "facilities":
              return levelToValue(house.facilities);
            case "riskNotes":
              return levelToValue(house.riskNotes);
            case "rating":
              return getTotalRating(house);
            default:
              return 0;
          }
        };

        sorted.sort((a, b) => {
          const valA = getValue(a);
          const valB = getValue(b);
          return sortOrder === "asc" ? valA - valB : valB - valA;
        });

        return sorted;
      },

      getCandidateHouses: () => {
        const { getFilteredHouses, getTotalRating } = get();
        const sorted = [...getFilteredHouses()];
        sorted.sort((a, b) => getTotalRating(b) - getTotalRating(a));
        return sorted;
      },
    }),
    {
      name: "rental-compare-data",
      version: 3,
      migrate: (persistedState: any, version) => {
        if (!persistedState || !persistedState.houses) return persistedState;
        const state = persistedState as HouseStore;
        state.houses = state.houses.map((h) => normalizeHouse(h));
        if (!state.weights) state.weights = DEFAULT_WEIGHTS;
        if (!state.filters) state.filters = DEFAULT_FILTERS;
        if (!state.filterPresets) state.filterPresets = [];
        return state;
      },
    }
  )
);
