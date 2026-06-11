import { useState } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import { HOUSE_STATUS_OPTIONS } from "@/types";
import type { House, HouseStatus } from "@/types";
import { Copy, Check, FileText, ClipboardList, Trophy } from "lucide-react";

type TabType = "viewing" | "questions" | "candidates";

const STATUS_LABEL: Record<HouseStatus, string> = {
  pending: "待联系",
  contacted: "已联系",
  scheduled: "已预约",
  viewed: "已看房",
  eliminated: "已淘汰",
  shortlisted: "重点考虑",
};

const STATUS_ORDER: HouseStatus[] = [
  "shortlisted",
  "scheduled",
  "viewed",
  "contacted",
  "pending",
  "eliminated",
];

const QUESTIONS_TEMPLATE = [
  "租金是否包含物业费、网费？",
  "水电费如何计算？是民水民电吗？",
  "押金多少？退租时如何退还？",
  "最短租期是多久？可以转租吗？",
  "房屋维修谁负责？",
  "可以养宠物吗？",
  "室友的作息和生活习惯？",
  "周边有没有超市、菜市场？",
  "距离地铁站/公交站多远？",
  "房子是哪年的？装修多久了？",
  "隔音效果怎么样？",
  "有没有电梯？几楼？",
  "可以做饭吗？厨房设施如何？",
  "暖气/空调情况如何？",
  "有没有纱窗？蚊虫多不多？",
];

const DIMENSION_LABELS: Record<string, string> = {
  safety: "安全",
  valueForMoney: "性价比",
  convenience: "便利",
  comfort: "舒适",
};

export default function ExportPanel() {
  const {
    houses,
    getFilteredHouses,
    getCandidateHouses,
    getTotalRating,
    getRatingBreakdown,
    getCostBreakdown,
    hasActiveFilters,
    weights,
  } = useHouseStore();
  const [activeTab, setActiveTab] = useState<TabType>("viewing");
  const [copied, setCopied] = useState(false);

  const filteredHouses = getFilteredHouses();
  const candidateHouses = getCandidateHouses();

  const groupByStatus = (list: House[]): Record<string, House[]> => {
    const groups: Record<string, House[]> = {};
    STATUS_ORDER.forEach((s) => {
      const items = list.filter((h) => h.status === s);
      if (items.length > 0) {
        groups[s] = items;
      }
    });
    return groups;
  };

  const generateViewingList = (): string => {
    const exportHouses = hasActiveFilters() ? filteredHouses : houses;
    if (exportHouses.length === 0) return "暂无房源信息";

    let text = "📋 看房清单\n";
    text += "=".repeat(30) + "\n";
    if (hasActiveFilters()) {
      text += `（已应用筛选条件，共${exportHouses.length}套）\n`;
    }
    text += "\n";

    const grouped = groupByStatus(exportHouses);

    STATUS_ORDER.forEach((status) => {
      const group = grouped[status];
      if (!group) return;

      text += `【${STATUS_LABEL[status]}】（${group.length}套）\n`;
      text += "-".repeat(20) + "\n";

      group.forEach((house, index) => {
        const rating = getTotalRating(house);
        text += `  ${index + 1}. ${house.name || "未命名房源"}\n`;
        text += `     📍 ${house.address || "未填写"}\n`;
        text += `     💰 ¥${house.rent?.toLocaleString() || 0}/月 · 📐 ${house.area || 0}㎡ · 🛏️ ${house.roomType || "未填写"}\n`;
        text += `     🚇 通勤${house.commuteTime || 0}分钟 ·  入住${house.moveInDate || "未填写"}\n`;
        text += `     ⭐ ${rating.toFixed(1)}分\n`;
        text += `     📝 预约时间：___________\n`;
        text += `     📞 联系方式：___________\n`;
      });

      text += "\n";
    });

    text += "💡 看房前准备：\n";
    text += "  □ 身份证\n";
    text += "  □ 卷尺（测量面积）\n";
    text += "  □ 手机（拍照、录音）\n";
    text += "  □ 充电宝\n";

    return text;
  };

  const generateQuestionList = (): string => {
    let text = "❓ 看房问题清单\n";
    text += "=".repeat(30) + "\n\n";

    text += "💰 费用相关\n";
    QUESTIONS_TEMPLATE.slice(0, 4).forEach((q, i) => {
      text += `  ${i + 1}. ${q}\n`;
    });
    text += "\n";

    text += "🏠 房屋情况\n";
    QUESTIONS_TEMPLATE.slice(4, 9).forEach((q, i) => {
      text += `  ${i + 1}. ${q}\n`;
    });
    text += "\n";

    text += "🔊 居住环境\n";
    QUESTIONS_TEMPLATE.slice(9, 13).forEach((q, i) => {
      text += `  ${i + 1}. ${q}\n`;
    });
    text += "\n";

    text += "🛋️ 设施配套\n";
    QUESTIONS_TEMPLATE.slice(13).forEach((q, i) => {
      text += `  ${i + 1}. ${q}\n`;
    });
    text += "\n";

    text += "\n📝 自定义问题：\n";
    text += "  1. ___________\n";
    text += "  2. ___________\n";
    text += "  3. ___________\n";

    return text;
  };

  const generateCandidateList = (): string => {
    const topHouses = candidateHouses.slice(0, 5);
    if (topHouses.length === 0) return "暂无候选房源";

    const totalWeight =
      weights.safety + weights.valueForMoney + weights.convenience + weights.comfort;

    let text = "🏆 最终候选列表\n";
    text += "=".repeat(30) + "\n";
    text += `（按加权综合评分降序排列，共${topHouses.length}套）\n`;
    if (hasActiveFilters()) {
      text += `（已应用筛选条件）\n`;
    }
    if (totalWeight > 0) {
      const pct = (w: number) => Math.round((w / totalWeight) * 100);
      text += `权重配置：安全${pct(weights.safety)}% / 性价比${pct(weights.valueForMoney)}% / 便利${pct(weights.convenience)}% / 舒适${pct(weights.comfort)}%\n`;
    }
    text += "\n";

    topHouses.forEach((house, index) => {
      const rating = getTotalRating(house);
      const breakdown = getRatingBreakdown(house);
      const cost = getCostBreakdown(house);
      const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

      text += `${medals[index]} 第${index + 1}名：${house.name || "未命名"}\n`;
      text += `   综合评分：⭐ ${rating.toFixed(1)}分\n`;

      if (totalWeight > 0) {
        text += `   评分构成：\n`;
        const entries = Object.entries(breakdown) as [string, number][];
        const sorted = entries.sort((a, b) => b[1] - a[1]);
        sorted.forEach(([key, value]) => {
          const pct = totalWeight > 0 ? Math.round((value / rating) * 100) : 0;
          text += `     · ${DIMENSION_LABELS[key] || key}：贡献 ${pct}%（${value.toFixed(2)}分）\n`;
        });
      }

      text += `   💸 月均真实成本：¥${Math.round(cost.monthlyRealCost).toLocaleString()}\n`;
      text += `      （月租¥${house.rent?.toLocaleString() || 0} + 押金月均¥${Math.round(house.deposit / 12).toLocaleString()} + 通勤¥${house.commuteCostMonthly || 0} + 水电网¥${house.utilityEstimate || 0}）\n`;
      text += `   💰 首月现金压力：¥${Math.round(cost.firstMonthCash).toLocaleString()}\n`;
      text += `      （月租+押金+中介费¥${house.agencyFee || 0}+搬家费¥${house.movingFee || 0}）\n`;
      text += `   🚇 通勤时间：${house.commuteTime || 0}分钟\n`;
      text += `   🏠 面积房型：${house.area || 0}㎡ · ${house.roomType || "未填写"}\n`;
      text += `   📋 看房状态：${STATUS_LABEL[house.status] || "待联系"}\n`;
      text += `   📍 详细地址：${house.address || "未填写"}\n`;

      if (house.viewingDate) {
        text += `   📅 看房日期：${house.viewingDate}\n`;
      }
      if (house.contactName || house.contactPhone) {
        text += `   📞 联系人：${house.contactName || "-"} ${house.contactPhone || ""}\n`;
      }
      if (house.viewingNotes) {
        text += `   📝 看房结论：${house.viewingNotes}\n`;
      }
      if (house.status === "shortlisted" && house.shortlistReason) {
        text += `   ✨ 入选理由：${house.shortlistReason}\n`;
      }
      if (house.status === "eliminated" && house.eliminateReason) {
        text += `   ❌ 淘汰原因：${house.eliminateReason}\n`;
      }

      if (house.mapNotes && house.mapNotes.length > 0) {
        text += `   🏪 周边设施：${house.mapNotes.map((n) => n.name).join("、")}\n`;
      }

      text += `   优势亮点：___________\n`;
      text += `   顾虑担忧：___________\n`;
      text += "\n";
    });

    text += "\n📊 对比总结：\n";
    text += "  性价比最高：___________\n";
    text += "  通勤最方便：___________\n";
    text += "  居住最舒适：___________\n";
    text += "  最终决定：___________\n";

    return text;
  };

  const getContent = () => {
    switch (activeTab) {
      case "viewing":
        return generateViewingList();
      case "questions":
        return generateQuestionList();
      case "candidates":
        return generateCandidateList();
      default:
        return "";
    }
  };

  const handleCopy = async () => {
    const content = getContent();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败", err);
    }
  };

  const tabs: { key: TabType; label: string; icon: typeof FileText }[] = [
    { key: "viewing", label: "看房清单", icon: FileText },
    { key: "questions", label: "问题清单", icon: ClipboardList },
    { key: "candidates", label: "候选列表", icon: Trophy },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-warm-100 bg-gradient-to-r from-warm-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-semibold text-gray-800">
              导出区
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {activeTab === "candidates"
                ? "候选列表始终按综合评分排序，含决策解释"
                : hasActiveFilters() && activeTab === "viewing"
                ? "已应用当前筛选条件，按状态分组"
                : "一键复制，粘贴到备忘录或微信"}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 shrink-0 ${
              copied
                ? "bg-green-100 text-green-600"
                : "bg-primary-500 text-white hover:bg-primary-600"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                复制内容
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-100 px-4">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-4">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-warm-50/50 rounded-xl p-4 h-[320px] overflow-y-auto leading-relaxed">
          {getContent()}
        </pre>
      </div>
    </div>
  );
}
