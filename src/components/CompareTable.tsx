import { useHouseStore } from "@/store/useHouseStore";
import type { SortField } from "@/types";
import { ArrowUpDown, ArrowUp, ArrowDown, Home } from "lucide-react";

const SORT_COLUMNS: {
  field: SortField;
  label: string;
  tooltip?: string;
}[] = [
  { field: "totalCost", label: "月均成本", tooltip: "租金 + 押金/12" },
  { field: "commuteTime", label: "通勤时间" },
  { field: "lighting", label: "采光" },
  { field: "noise", label: "噪音" },
  { field: "facilities", label: "设施" },
  { field: "riskNotes", label: "风险" },
  { field: "rating", label: "综合评分" },
];

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
    selectedHouseId,
    setSelectedHouse,
    sortField,
    sortOrder,
    toggleSort,
    getTotalRating,
  } = useHouseStore();

  const sortedHouses = getSortedHouses();

  const getCostColor = (rent: number) => {
    const allRents = sortedHouses.map((h) => h.rent + h.deposit / 12);
    const min = Math.min(...allRents);
    const max = Math.max(...allRents);
    const cost = rent;
    if (cost <= min) return "text-green-600 font-semibold";
    if (cost >= max) return "text-red-500";
    return "text-gray-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-warm-100 bg-gradient-to-r from-warm-50 to-white">
        <h2 className="font-serif text-lg font-semibold text-gray-800">
          房源对比表
        </h2>
        <p className="text-sm text-gray-500 mt-1">点击表头进行排序，绿色为最优</p>
      </div>

      {sortedHouses.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <Home className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>暂无房源数据</p>
          <p className="text-sm mt-1">添加房源后即可在此对比</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 sticky left-0 bg-gray-50/90 backdrop-blur z-10 min-w-[160px]">
                  房源
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
                const totalCost = house.rent + house.deposit / 12;
                const rating = getTotalRating(house);
                const isSelected = selectedHouseId === house.id;

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
                            {house.area}㎡ · {house.roomType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm ${getCostColor(totalCost)}`}>
                        ¥{Math.round(totalCost).toLocaleString()}
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
