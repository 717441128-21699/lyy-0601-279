import { useState } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import { Bookmark, Plus, Trash2, Play, X } from "lucide-react";

export default function FilterPresets() {
  const {
    filterPresets,
    addFilterPreset,
    applyFilterPreset,
    deleteFilterPreset,
    hasActiveFilters,
    filters,
  } = useHouseStore();

  const [showSave, setShowSave] = useState(false);
  const [presetName, setPresetName] = useState("");

  const handleSave = () => {
    if (presetName.trim()) {
      addFilterPreset(presetName.trim());
      setPresetName("");
      setShowSave(false);
    }
  };

  const describeFilters = (f: typeof filters): string => {
    const parts: string[] = [];
    if (f.rentMin !== null) parts.push(`≥¥${f.rentMin}`);
    if (f.rentMax !== null) parts.push(`≤¥${f.rentMax}`);
    if (f.commuteMax !== null) parts.push(`通勤≤${f.commuteMax}min`);
    if (f.roomType) parts.push(f.roomType);
    if (f.moveInDateBefore) parts.push(`入住≤${f.moveInDateBefore}`);
    if (f.status) {
      const labels: Record<string, string> = {
        pending: "待联系",
        contacted: "已联系",
        scheduled: "已预约",
        viewed: "已看房",
        eliminated: "已淘汰",
        shortlisted: "重点考虑",
      };
      parts.push(labels[f.status] || f.status);
    }
    return parts.length > 0 ? parts.join(" · ") : "无筛选条件";
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
            <Bookmark className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <h3 className="font-serif text-sm font-semibold text-gray-800">
            筛选方案
          </h3>
        </div>
        <button
          onClick={() => setShowSave(!showSave)}
          disabled={!hasActiveFilters()}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            hasActiveFilters()
              ? "text-purple-600 hover:bg-purple-50 bg-purple-50/50"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          <Plus className="w-3 h-3" />
          保存当前
        </button>
      </div>

      {showSave && hasActiveFilters() && (
        <div className="flex items-center gap-2 mb-3 animate-slide-up">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="方案名称，如：低预算"
            className="flex-1 px-3 py-1.5 rounded-lg border border-purple-200 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-medium hover:bg-purple-600"
          >
            保存
          </button>
          <button
            onClick={() => {
              setShowSave(false);
              setPresetName("");
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {filterPresets.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-3">
          设置筛选条件后，点击"保存当前"创建方案
        </p>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {filterPresets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warm-50/80 group hover:bg-purple-50/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 truncate">
                  {preset.name}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {describeFilters(preset.filters)}
                </div>
              </div>
              <button
                onClick={() => applyFilterPreset(preset.id)}
                className="p-1.5 text-purple-500 hover:bg-purple-100 rounded-lg transition-colors shrink-0"
                title="应用此方案"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteFilterPreset(preset.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                title="删除方案"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
