import { useHouseStore } from "@/store/useHouseStore";
import { RATING_DIMENSIONS, type Ratings } from "@/types";
import StarRating from "./StarRating";
import { Shield, DollarSign, MapPin, Home as HomeIcon, Star } from "lucide-react";

const iconMap: Record<string, typeof Shield> = {
  shield: Shield,
  "dollar-sign": DollarSign,
  "map-pin": MapPin,
  home: HomeIcon,
};

const dimensionColors: Record<string, { bg: string; text: string; bar: string }> = {
  safety: { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-400" },
  valueForMoney: { bg: "bg-green-50", text: "text-green-600", bar: "bg-green-400" },
  convenience: { bg: "bg-accent-50", text: "text-accent-600", bar: "bg-accent-400" },
  comfort: { bg: "bg-primary-50", text: "text-primary-600", bar: "bg-primary-400" },
};

export default function RatingCard() {
  const { selectedHouseId, houses, updateHouse, getTotalRating } = useHouseStore();

  const selectedHouse = houses.find((h) => h.id === selectedHouseId);
  const ratings = selectedHouse?.ratings;
  const totalRating = selectedHouse ? getTotalRating(selectedHouse) : 0;

  const handleRatingChange = (key: keyof Ratings, value: number) => {
    if (!selectedHouseId) return;
    updateHouse(selectedHouseId, {
      ratings: {
        ...ratings!,
        [key]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-warm-100 bg-gradient-to-r from-primary-50 to-white">
        <h2 className="font-serif text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary-500 fill-primary-500" />
          评分卡
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedHouse ? selectedHouse.name : "请先选择房源"}
        </p>
      </div>

      <div className="flex-1 p-5 flex flex-col">
        {!selectedHouse ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">请先选择一套房源</p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50">
                <span className="text-4xl font-bold text-primary-600 font-serif">
                  {totalRating.toFixed(1)}
                </span>
                <div className="mt-1">
                  <StarRating value={Math.round(totalRating)} size="sm" readOnly />
                </div>
                <span className="text-xs text-gray-500 mt-1">综合评分</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {RATING_DIMENSIONS.map((dim) => {
                const IconComponent = iconMap[dim.icon];
                const colors = dimensionColors[dim.key];
                const value = ratings?.[dim.key] || 0;
                const percentage = (value / 5) * 100;

                return (
                  <div key={dim.key} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}
                        >
                          <IconComponent className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {dim.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating
                          value={value}
                          onChange={(v) => handleRatingChange(dim.key, v)}
                          size="sm"
                        />
                        <span className="text-sm font-semibold text-gray-600 w-6 text-right">
                          {value}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors.bar} rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500 space-y-1">
                <p>💡 提示：点击星级进行打分</p>
                <p>📊 综合评分是四项的平均值</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
