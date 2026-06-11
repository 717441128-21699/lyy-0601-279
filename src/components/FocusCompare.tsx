import { useState } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import type { House } from "@/types";
import {
  GitCompare,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Wallet,
  Train,
  ShieldAlert,
  Sofa,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type CompareDim = "monthlyRealCost" | "commute" | "risk" | "comfort";

const DIM_META: Record<
  CompareDim,
  {
    label: string;
    icon: typeof Wallet;
    accent: string;
    accentBg: string;
    unit?: string;
    lowerIsBetter: boolean;
  }
> = {
  monthlyRealCost: {
    label: "真实月成本",
    icon: Wallet,
    accent: "text-primary-600",
    accentBg: "bg-primary-50",
    unit: "¥",
    lowerIsBetter: true,
  },
  commute: {
    label: "通勤时间",
    icon: Train,
    accent: "text-blue-600",
    accentBg: "bg-blue-50",
    unit: "分钟",
    lowerIsBetter: true,
  },
  risk: {
    label: "综合风险",
    icon: ShieldAlert,
    accent: "text-red-600",
    accentBg: "bg-red-50",
    lowerIsBetter: true,
  },
  comfort: {
    label: "居住舒适度",
    icon: Sofa,
    accent: "text-green-600",
    accentBg: "bg-green-50",
    lowerIsBetter: false,
  },
};

export default function FocusCompare() {
  const { houses, getTotalRating, getCostBreakdown, getRatingBreakdown } =
    useHouseStore();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const shortlist = houses
    .filter((h) => h.status === "shortlisted")
    .sort((a, b) => getTotalRating(b) - getTotalRating(a))
    .slice(0, 3);

  const fallback = houses
    .sort((a, b) => getTotalRating(b) - getTotalRating(a))
    .slice(0, 3);

  const list = shortlist.length >= 2 ? shortlist : fallback.slice(0, 2);

  const getValue = (house: House, dim: CompareDim): number => {
    switch (dim) {
      case "monthlyRealCost":
        return getCostBreakdown(house).monthlyRealCost;
      case "commute":
        return house.commuteTime || 0;
      case "risk": {
        const lv = (v: string) =>
          v === "优秀" ? 1 : v === "良好" ? 2 : v === "一般" ? 3 : v === "较差" ? 4 : 5;
        return lv(house.riskNotes) + lv(house.noise) + lv(house.facilities);
      }
      case "comfort":
        return (
          getRatingBreakdown(house).comfort + getRatingBreakdown(house).safety
        );
      default:
        return 0;
    }
  };

  const getBestWorst = (
    dim: CompareDim
  ): { best: House | null; worst: House | null } => {
    if (list.length === 0) return { best: null, worst: null };
    const meta = DIM_META[dim];
    const sorted = [...list].sort((a, b) => {
      const va = getValue(a, dim);
      const vb = getValue(b, dim);
      return meta.lowerIsBetter ? va - vb : vb - va;
    });
    if (list.length === 1) return { best: sorted[0], worst: null };
    return { best: sorted[0], worst: sorted[sorted.length - 1] };
  };

  const getDiffText = (dim: CompareDim): string => {
    if (list.length < 2) return "";
    const { best, worst } = getBestWorst(dim);
    if (!best || !worst) return "";
    const vBest = getValue(best, dim);
    const vWorst = getValue(worst, dim);
    const diff = Math.abs(vBest - vWorst);
    if (diff === 0) return "几乎持平";
    const meta = DIM_META[dim];
    if (dim === "comfort") {
      return `${best.name} 领先约 ${diff.toFixed(1)} 分`;
    }
    if (dim === "risk") {
      return `${best.name} 风险更低，差 ${diff} 级`;
    }
    return `${best.name} 便宜/快约 ${Math.round(diff)}${meta.unit || ""}`;
  };

  const generateAdviceText = (): string => {
    if (list.length < 2) return "至少要有 2 套房源才能做参谋对比～";

    let text = "🏠 租房参谋对比\n";
    text += "=".repeat(30) + "\n";
    text += `共 ${list.length} 套候选：${list.map((h) => h.name).join(" vs ")}\n\n`;

    text += "📊 四维关键差异\n";
    text += "-".repeat(20) + "\n";
    (Object.keys(DIM_META) as CompareDim[]).forEach((dim) => {
      const meta = DIM_META[dim];
      const { best, worst } = getBestWorst(dim);
      const diff = getDiffText(dim);
      text += `【${meta.label}】\n`;
      list.forEach((h) => {
        const v = getValue(h, dim);
        const flag =
          h.id === best?.id
            ? " ✅ 最优"
            : h.id === worst?.id && list.length >= 2
            ? " ⚠️ 最弱"
            : "";
        if (dim === "monthlyRealCost") {
          text += `  · ${h.name}：¥${Math.round(v).toLocaleString()}/月${flag}\n`;
        } else if (dim === "commute") {
          text += `  · ${h.name}：${v}分钟${flag}\n`;
        } else if (dim === "risk") {
          text += `  · ${h.name}：风险${v}级（越低越好）${flag}\n`;
        } else {
          text += `  · ${h.name}：${v.toFixed(1)}分${flag}\n`;
        }
      });
      text += `  ➡️ ${diff}\n\n`;
    });

    text += "🎯 综合结论\n";
    const top = list[0];
    const runnerUp = list[1];
    if (top && runnerUp) {
      const diff = getTotalRating(top) - getTotalRating(runnerUp);
      text += `  综合评分：${top.name} ${getTotalRating(top).toFixed(1)} 分，领先 ${runnerUp.name} ${diff.toFixed(1)} 分\n`;
      if (top.shortlistReason) {
        text += `  你选中 ${top.name} 的理由：${top.shortlistReason}\n`;
      }
    }
    text += "\n💡 建议：";
    const cheap = getBestWorst("monthlyRealCost").best;
    const fast = getBestWorst("commute").best;
    const comfy = getBestWorst("comfort").best;
    if (cheap?.id === fast?.id && cheap?.id === comfy?.id) {
      text += `${cheap?.name} 在所有维度都领先，可以重点考虑签合同～`;
    } else {
      text += `${cheap?.name} 最划算，${fast?.name} 最方便，${comfy?.name} 住得最舒服，看你更看重什么啦～`;
    }
    text += "\n\n👋 帮我参谋参谋，你觉得哪套更好？";

    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateAdviceText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (list.length < 2) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-warm-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
            <GitCompare className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <h3 className="font-serif text-sm font-semibold text-gray-800">
            重点对比
          </h3>
        </div>
        <p className="text-xs text-gray-400 text-center py-6">
          把至少 2 套房源标记为「重点考虑」，或在列表中添加更多房源
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-warm-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
            <GitCompare className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-semibold text-gray-800">
              重点对比
            </h3>
            <p className="text-[11px] text-gray-400">
              {shortlist.length >= 2
                ? `${shortlist.length} 套重点房源`
                : `用评分 Top${list.length} 作为参考`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              copied
                ? "bg-green-100 text-green-600"
                : "bg-primary-50 text-primary-600 hover:bg-primary-100"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                复制给朋友
              </>
            )}
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-warm-100 pt-3">
          {(Object.keys(DIM_META) as CompareDim[]).map((dim) => {
            const meta = DIM_META[dim];
            const Icon = meta.icon;
            const { best, worst } = getBestWorst(dim);
            const diff = getDiffText(dim);

            return (
              <div key={dim} className={`rounded-xl ${meta.accentBg} p-3`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${meta.accent}`} />
                    <span className={`text-xs font-semibold ${meta.accent}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <Sparkles className="w-3 h-3" />
                    {diff}
                  </div>
                </div>
                <div className="flex gap-2">
                  {list.map((h) => {
                    const v = getValue(h, dim);
                    const isBest = h.id === best?.id;
                    const isWorst = h.id === worst?.id && list.length >= 2;

                    return (
                      <div
                        key={h.id}
                        className={`flex-1 rounded-lg px-2 py-2 ${
                          isBest
                            ? "bg-white shadow-sm ring-1 ring-current ring-green-400"
                            : isWorst
                            ? "bg-white/70"
                            : "bg-white/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-500 truncate">
                            {h.name}
                          </span>
                          {isBest ? (
                            <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                          ) : isWorst ? (
                            <XCircle className="w-3 h-3 text-red-400 shrink-0" />
                          ) : (
                            <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                          )}
                        </div>
                        <div className={`text-sm font-bold mt-0.5 ${meta.accent}`}>
                          {dim === "monthlyRealCost"
                            ? `¥${Math.round(v).toLocaleString()}`
                            : dim === "commute"
                            ? `${v}分钟`
                            : dim === "risk"
                            ? `${v}级`
                            : v.toFixed(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {list.length >= 2 && (
                  <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-500">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span>{diff}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
