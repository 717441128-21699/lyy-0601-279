import { useState } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import { HOUSE_STATUS_OPTIONS } from "@/types";
import type { House, HouseStatus } from "@/types";
import {
  Calendar,
  Phone,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  MessageSquare,
} from "lucide-react";

const STATUS_META: Record<HouseStatus, { label: string; icon: typeof Clock; color: string; bgColor: string }> = {
  pending: { label: "待联系", icon: Clock, color: "text-gray-600", bgColor: "bg-gray-100" },
  contacted: { label: "已联系", icon: MessageSquare, color: "text-blue-600", bgColor: "bg-blue-100" },
  scheduled: { label: "已预约", icon: Calendar, color: "text-purple-600", bgColor: "bg-purple-100" },
  viewed: { label: "已看房", icon: CheckCircle2, color: "text-teal-600", bgColor: "bg-teal-100" },
  eliminated: { label: "已淘汰", icon: XCircle, color: "text-red-600", bgColor: "bg-red-100" },
  shortlisted: { label: "重点考虑", icon: Star, color: "text-green-600", bgColor: "bg-green-100" },
};

export default function ViewingSchedule() {
  const { houses, updateHouse, setSelectedHouse, selectedHouseId } = useHouseStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortByDate = (a: House, b: House) => {
    const dA = a.viewingDate ? new Date(a.viewingDate).getTime() : Infinity;
    const dB = b.viewingDate ? new Date(b.viewingDate).getTime() : Infinity;
    return dA - dB;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "未安排";
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateOnly = new Date(d);
    dateOnly.setHours(0, 0, 0, 0);
    const diffDays = Math.round((dateOnly.getTime() - today.getTime()) / 86400000);
    const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][d.getDay()];
    const dateText = `${d.getMonth() + 1}月${d.getDate()}日 ${weekday}`;
    if (diffDays === 0) return `${dateText}（今天）`;
    if (diffDays === 1) return `${dateText}（明天）`;
    if (diffDays < 0) return `${dateText}（已过）`;
    return `${dateText}（${diffDays}天后）`;
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleQuickStatus = (house: House, status: HouseStatus) => {
    if (status === "scheduled" && !house.viewingDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      updateHouse(house.id, {
        status,
        viewingDate: tomorrow.toISOString().slice(0, 10),
      });
    } else {
      updateHouse(house.id, { status });
    }
  };

  const renderHouseCard = (house: House) => {
    const isExpanded = expandedId === house.id;
    const meta = STATUS_META[house.status] || STATUS_META.pending;
    const Icon = meta.icon;

    return (
      <div
        key={house.id}
        onClick={() => setSelectedHouse(house.id)}
        className={`rounded-xl border transition-all cursor-pointer ${
          selectedHouseId === house.id
            ? "border-primary-300 bg-primary-50/50"
            : "border-warm-100 bg-white hover:bg-warm-50/30"
        }`}
      >
        <div
          className="px-3 py-2.5"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(house.id);
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className={`p-1 rounded-md ${meta.bgColor}`}>
                <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
              </span>
              <span className="text-sm font-medium text-gray-800 truncate">
                {house.name || "未命名"}
              </span>
            </div>
            <span className="text-xs text-gray-500 shrink-0">
              {formatDate(house.viewingDate)}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="px-3 pb-3 pt-1 space-y-2 border-t border-warm-100">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1 text-gray-600">
                <User className="w-3 h-3 text-gray-400" />
                <input
                  type="text"
                  value={house.contactName || ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    updateHouse(house.id, { contactName: e.target.value })
                  }
                  placeholder="联系人"
                  className="flex-1 px-2 py-1 rounded-md bg-warm-50 border border-transparent focus:border-primary-300 focus:bg-white outline-none text-xs"
                />
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Phone className="w-3 h-3 text-gray-400" />
                <input
                  type="tel"
                  value={house.contactPhone || ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    updateHouse(house.id, { contactPhone: e.target.value })
                  }
                  placeholder="电话"
                  className="flex-1 px-2 py-1 rounded-md bg-warm-50 border border-transparent focus:border-primary-300 focus:bg-white outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
              <input
                type="date"
                value={house.viewingDate || ""}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  updateHouse(house.id, { viewingDate: e.target.value })
                }
                className="flex-1 px-2 py-1 rounded-md bg-warm-50 border border-transparent focus:border-primary-300 focus:bg-white outline-none text-xs"
              />
            </div>

            <textarea
              value={house.viewingNotes || ""}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                updateHouse(house.id, { viewingNotes: e.target.value })
              }
              placeholder="看房结论 / 聊天记录要点..."
              rows={2}
              className="w-full px-2 py-1.5 rounded-md bg-warm-50 border border-transparent focus:border-primary-300 focus:bg-white outline-none text-xs resize-none"
            />

            {house.status === "shortlisted" && (
              <textarea
                value={house.shortlistReason || ""}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  updateHouse(house.id, { shortlistReason: e.target.value })
                }
                placeholder="为什么重点考虑这套？"
                rows={1}
                className="w-full px-2 py-1.5 rounded-md bg-green-50 border border-green-100 focus:border-green-300 focus:bg-white outline-none text-xs resize-none"
              />
            )}
            {house.status === "eliminated" && (
              <textarea
                value={house.eliminateReason || ""}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  updateHouse(house.id, { eliminateReason: e.target.value })
                }
                placeholder="淘汰原因是？"
                rows={1}
                className="w-full px-2 py-1.5 rounded-md bg-red-50 border border-red-100 focus:border-red-300 focus:bg-white outline-none text-xs resize-none"
              />
            )}

            <div className="flex flex-wrap gap-1 pt-1">
              {HOUSE_STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickStatus(house, opt.value);
                  }}
                  className={`px-2 py-1 rounded-full text-xs transition-all ${
                    house.status === opt.value
                      ? `${opt.bgColor} ${opt.color} ring-1 ring-current`
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const scheduled = houses.filter((h) => h.status === "scheduled").sort(sortByDate);
  const shortlisted = houses.filter((h) => h.status === "shortlisted").sort(sortByDate);
  const viewed = houses.filter((h) => h.status === "viewed").sort(sortByDate);
  const contacted = houses.filter((h) => h.status === "contacted");
  const eliminated = houses.filter((h) => h.status === "eliminated");
  const pending = houses.filter((h) => h.status === "pending");

  const renderSection = (
    title: string,
    list: House[],
    badgeColor: string
  ) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-2 h-2 rounded-full ${badgeColor}`} />
          <span className="text-xs font-medium text-gray-600">
            {title}
          </span>
          <span className="text-xs text-gray-400">· {list.length}</span>
        </div>
        <div className="space-y-2">{list.map(renderHouseCard)}</div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center">
          <Calendar className="w-3.5 h-3.5 text-primary-600" />
        </div>
        <h3 className="font-serif text-sm font-semibold text-gray-800">
          看房日程
        </h3>
        <span className="text-xs text-gray-400 ml-auto">{houses.length}套</span>
      </div>

      <div className="max-h-[480px] overflow-y-auto pr-1">
        {houses.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">
            还没有房源，添加后会按状态分组显示
          </p>
        ) : (
          <>
            {renderSection("近期预约", scheduled, "bg-purple-500")}
            {renderSection("重点考虑", shortlisted, "bg-green-500")}
            {renderSection("已看房", viewed, "bg-teal-500")}
            {renderSection("已联系", contacted, "bg-blue-500")}
            {renderSection("待联系", pending, "bg-gray-400")}
            {renderSection("已淘汰", eliminated, "bg-red-400")}
          </>
        )}
      </div>
    </div>
  );
}
