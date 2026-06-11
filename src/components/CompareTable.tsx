import { useState } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import type { SortField, HouseStatus } from "@/types";
import { ROOM_TYPE_OPTIONS, HOUSE_STATUS_OPTIONS } from "@/types";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Home,
  Filter,
  X,
  RotateCcw,
} from "lucide-react";

const SORT_COLUMNS: {
  field: SortField;
  label: string;
  tooltip?: string;
}[] = [
  { field: "totalCost", label: "真实月成本", tooltip: "含押金/中介费/搬家费按月均摊" },
  { field: "commuteTime", label: "通勤时间" },
  { field: "lighting", label: "采光" },
  { field: "noise", label: "噪音" },
  { field: "facilities", label: "设施" },
  { field: "riskNotes", label: "风险" },
  { field: "rating", label: "综合评分" },
];

const STATUS_BADGE: Record<HouseStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "待联系", color: "text-gray-600", bgColor: "bg-gray-100" },
  contacted: { label: "已联系", color: "text-blue-600", bgColor: "bg-blue-100" },
  scheduled: { label: "已预约", color: "text-purple-600", bgColor: "bg-purple-100" },
  viewed: { label: "已看房", color: "text-teal-600", bgColor: "bg-teal-100" },
  eliminated: { label: "已淘汰", color: "text-red-600", bgColor: "bg-red-100" },
  shortlisted: { label: "重点考虑", color: "text-green-600", bgColor: "bg-green-100" },
};

const levelColor = (level: string) => {
  const map: Record<string, string> = {
    优秀: "text-green-600 bg-green-50",
    良好: "text-accent-600 bg-accent-50",
    一般: "text-yellow-600 bg-yellow-50",
    较差: "text-orange-600 bg-orange-50",
    很差: "text-red-600 bg-red-50",
  };
  return map[level] || "text-gray-600 bg-gray-50";
};

export default function CompareTable() {
  const {
    getSortedHouses,
    getFilteredHouses,
    houses,
    selectedHouseId,
    setSelectedHouse,
    sortField,
    sortOrder,
    toggleSort,
    getTotalRating,
    getCostBreakdown,
    filters,
    setFilters,
    resetFilters,
    hasActiveFilters,
  } = useHouseStore();
  const [showFilters, setShowFilters] = useState(false);

  const sortedHouses = getSortedHouses();
  const filteredCount = getFilteredHouses().length;
  const totalCount = houses.length;

  const getCostColor = (cost: number) => {
    const allCosts = sortedHouses.map((h) => getCostBreakdown(h).monthlyRealCost);
    if (allCosts.length === 0) return "text-gray-700";
    const min = Math.min(...allCosts);
    const max = Math.max(...allCosts);
    if (cost <= min) return "text-green-600 font-semibold";
    if (cost >= max) return "text-red-500";
    return "text-gray-700";
  };

  const handleFilterChange = (key: string, value: string | number | null) => {
    if (key === "rentMin" || key === "rentMax" || key === "commuteMax") {
      const numValue =
        value === "" || value === null ? null : Number(value);
      setFilters({ [key]: numValue });
    } else {
      setFilters({ [key]: value });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-warm-100 bg-gradient-to-r from-warm-50 to-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-gray-800">
              房源对比表
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              点击表头进行排序，绿色为最优
              {hasActiveFilters() && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary-100 text-primary-600 text-xs font-medium">
                  筛选中 {filteredCount}/{totalCount}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${
              showFilters || hasActiveFilters()
                ? "bg-primary-100 text-primary-600"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {showFilters ? (
              <X className="w-4 h-4" />
            ) : (
              <Filter className="w-4 h-4" />
            )}
            筛选
            {hasActiveFilters() && !showFilters && (
              <span className="w-2 h-2 rounded-full bg-primary-500" />
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="px-6 py-4 border-b border-gray-100 bg-warm-50/30 animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                租金最低（元）
              </label>
              <input
                type="number"
                value={filters.rentMin ?? ""}
                onChange={(e) =>
                  handleFilterChange("rentMin", e.target.value)
                }
                placeholder="不限"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                租金最高（元）
              </label>
              <input
                type="number"
                value={filters.rentMax ?? ""}
                onChange={(e) =>
                  handleFilterChange("rentMax", e.target.value)
                }
                placeholder="不限"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                通勤上限（分钟）
              </label>
              <input
                type="number"
                value={filters.commuteMax ?? ""}
                onChange={(e) =>
                  handleFilterChange("commuteMax", e.target.value)
                }
                placeholder="不限"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                房型
              </label>
              <select
                value={filters.roomType}
                onChange={(e) =>
                  handleFilterChange("roomType", e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
              >
                <option value="">不限</option>
                {ROOM_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                可入住日期不晚于
              </label>
              <input
                type="date"
                value={filters.moveInDateBefore}
                onChange={(e) =>
                  handleFilterChange("moveInDateBefore", e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                看房状态
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  handleFilterChange("status", e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
              >
                <option value="">不限</option>
                {HOUSE_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end mt-4">
            <button
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              重置筛选
            </button>
          </div>
        </div>
      )}

      {sortedHouses.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <Home className="w-16 h-16 mx-auto mb-4 opacity-20" />
          {hasActiveFilters() ? (
            <>
              <p>没有符合筛选条件的房源</p>
              <button
                onClick={resetFilters}
                className="mt-2 text-sm text-primary-500 hover:text-primary-600"
              >
                清除筛选条件
              </button>
            </>
          ) : (
            <>
              <p>暂无房源数据</p>
              <p className="text-sm mt-1">添加房源后即可在此对比</p>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 sticky left-0 bg-gray-50/90 backdrop-blur z-10 min-w-[160px]">
                  房源
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 min-w-[80px] whitespace-nowrap">
                  状态
                </th>
                {SORT_COLUMNS.map((col) => (
                  <th
                    key={col.field}
                    className="px-4 py-3 text-center text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100/50 transition-colors min-w-[90px] whitespace-nowrap"
                    onClick={() => toggleSort(col.field)}
                    title={col.tooltip}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      {col.label}
                      {sortField === col.field ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="w-3.5 h-3.5 text-primary-500" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-primary-500" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedHouses.map((house, index) => {
                const cost = getCostBreakdown(house);
                const rating = getTotalRating(house);
                const isSelected = selectedHouseId === house.id;
                const badge = STATUS_BADGE[house.status] || STATUS_BADGE.pending;

                return (
                  <tr
                    key={house.id}
                    onClick={() => setSelectedHouse(house.id)}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary-50/70"
                        : index % 2 === 0
                        ? "bg-white hover:bg-warm-50/50"
                        : "bg-gray-50/30 hover:bg-warm-50/50"
                    }`}
                  >
                    <td className="px-4 py-3 sticky left-0 bg-inherit z-10">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            index === 0
                              ? "bg-primary-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">
                            {house.name || "未命名"}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[140px]">
                            {house.area}㎡ · {house.roomType || "不限"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bgColor} ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm ${getCostColor(cost.monthlyRealCost)}`}>
                        ¥{Math.round(cost.monthlyRealCost).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-700">
                        {house.commuteTime || "-"} 分钟
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${levelColor(
                          house.lighting
                        )}`}
                      >
                        {house.lighting || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${levelColor(
                          house.noise
                        )}`}
                      >
                        {house.noise || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${levelColor(
                          house.facilities
                        )}`}
                      >
                        {house.facilities || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${levelColor(
                          house.riskNotes
                        )}`}
                      >
                        {house.riskNotes || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-primary-600">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">/5</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
