import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { House, SortField, SortOrder } from "@/types";

interface HouseStore {
  houses: House[];
  selectedHouseId: string | null;
  sortField: SortField;
  sortOrder: SortOrder;
  addHouse: (house: Omit<House, "id" | "createdAt" | "updatedAt">) => void;
  updateHouse: (id: string, updates: Partial<House>) => void;
  deleteHouse: (id: string) => void;
  setSelectedHouse: (id: string | null) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSort: (field: SortField) => void;
  getSortedHouses: () => House[];
  getTotalRating: (house: House) => number;
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

export const useHouseStore = create<HouseStore>()(
  persist(
    (set, get) => ({
      houses: [],
      selectedHouseId: null,
      sortField: "totalCost",
      sortOrder: "asc",

      addHouse: (houseData) => {
        const now = new Date().toISOString();
        const newHouse: House = {
          ...houseData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
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

      getTotalRating: (house) => {
        const { safety, valueForMoney, convenience, comfort } = house.ratings;
        return (safety + valueForMoney + convenience + comfort) / 4;
      },

      getSortedHouses: () => {
        const { houses, sortField, sortOrder } = get();
        const sorted = [...houses];

        const getValue = (house: House): number => {
          switch (sortField) {
            case "totalCost":
              return house.rent + house.deposit / 12;
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
              return get().getTotalRating(house);
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
    }),
    {
      name: "rental-compare-data",
    }
  )
);
