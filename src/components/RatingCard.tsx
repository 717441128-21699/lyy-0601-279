import { useState } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import { RATING_DIMENSIONS, type Ratings, type Weights } from "@/types";
import StarRating from "./StarRating";
import {
  Shield,
  DollarSign,
  MapPin,
  Home as HomeIcon,
  Star,
  Settings,
  X,
  RotateCcw,
} from "lucide-react";

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
  const {
    selectedHouseId,
    houses,
    updateHouse,
    getTotalRating,
    weights,
    setWeights,
    resetWeights,
  } = useHouseStore();
  const [showWeights, setShowWeights] = useState(false);

  const selectedHouse = houses.find((h) => h.id === selectedHouseId);
  const ratings = selectedHouse?.ratings;
  const totalRating = selectedHouse ? getTotalRating(selectedHouse) : 0;

  const totalWeight =
    weights.safety +
    weights.valueForMoney +
    weights.convenience +
    weights.comfort;

  const handleRatingChange = (key: keyof Ratings, value: number) => {
    if (!selectedHouseId) return;
    updateHouse(selectedHouseId, {
      ratings: {
        ...ratings!,
        [key]: value,
      },
    });
  };

  const handleWeightChange = (key: keyof Weights, value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    setWeights({ [key]: clamped });
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-warm-100 bg-gradient-to-r from-primary-50 to-white">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary-500 fill-primary-500" />
            评分卡
          </h2>
          <button
            onClick={() => setShowWeights(!showWeights)}
            className={`p-2 rounded-lg transition-colors ${
              showWeights
                ? "bg-primary-100 text-primary-600"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            title="设置权重"
          >
            {showWeights ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {selectedHouse ? selectedHouse.name : "请先选择房源"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showWeights && (
          <div className="px-5 pt-4 pb-2 border-b border-gray-100 bg-warm-50/50 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">
                权重设置（当前总和：{totalWeight}）
              </h3>
              <button
                onClick={resetWeights}
                className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                重置
              </button>
            </div>
            <div className="space-y-3">
              {RATING_DIMENSIONS.map((dim) => {
                const weight = weights[dim.key];
                const percentage = (weight / totalWeight) * 100;
                const colors = dimensionColors[dim.key];
                return (
                  <div key={dim.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">{dim.label}</span>
                      <span className="text-xs font-medium text-gray-700">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={weight}
                        onChange={(e) =>
                          handleWeightChange(dim.key, Number(e.target.value))
                        }
                        className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer accent-current ${colors.text}`}
                        style={{
                          background: `linear-gradient(to right, currentColor 0%, currentColor ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
                        }}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={weight}
                        onChange={(e) =>
                          handleWeightChange(dim.key, Number(e.target.value))
                        }
                        className="w-14 px-2 py-1 text-xs text-center rounded border border-gray-200 focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              权重越高，该维度对综合评分的影响越大
            </p>
          </div>
        )}

        <div className="p-5 flex flex-col h-full">
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
                    <StarRating
                      value={Math.round(totalRating)}
                      size="sm"
                      readOnly
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    综合评分{showWeights && "（加权）"}
                  </span>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {RATING_DIMENSIONS.map((dim) => {
                  const IconComponent = iconMap[dim.icon];
                  const colors = dimensionColors[dim.key];
                  const value = ratings?.[dim.key] || 0;
                  const percentage = (value / 5) * 100;
                  const weightPct = ((weights[dim.key] || 0) / totalWeight) * 100;

                  return (
                    <div key={dim.key} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}
                          >
                            <IconComponent
                              className={`w-4 h-4 ${colors.text}`}
                            />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              {dim.label}
                            </span>
                            {showWeights && (
                              <span className="text-xs text-gray-400 ml-2">
                                权重 {weightPct.toFixed(0)}%
                              </span>
                            )}
                          </div>
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
                  <p>⚙️ 右上角齿轮可设置各维度权重</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
