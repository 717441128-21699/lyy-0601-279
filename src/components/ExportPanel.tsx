import { useState } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import { Copy, Check, FileText, ClipboardList, Trophy } from "lucide-react";

type TabType = "viewing" | "questions" | "candidates";

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

export default function ExportPanel() {
  const { houses, getSortedHouses, getTotalRating } = useHouseStore();
  const [activeTab, setActiveTab] = useState<TabType>("viewing");
  const [copied, setCopied] = useState(false);

  const sortedHouses = getSortedHouses();

  const generateViewingList = (): string => {
    if (houses.length === 0) return "暂无房源信息";

    let text = "📋 看房清单\n";
    text += "=".repeat(30) + "\n\n";

    houses.forEach((house, index) => {
      const rating = getTotalRating(house);
      text += `【第${index + 1}套】${house.name || "未命名房源"}\n`;
      text += `  📍 地址：${house.address || "未填写"}\n`;
      text += `  💰 租金：¥${house.rent?.toLocaleString() || 0}/月\n`;
      text += `  📦 押金：¥${house.deposit?.toLocaleString() || 0}\n`;
      text += `  📐 面积：${house.area || 0}㎡\n`;
      text += `  🛏️ 房型：${house.roomType || "未填写"}\n`;
      text += `  🚇 通勤：${house.commuteTime || 0}分钟\n`;
      text += `  👥 室友：${house.roommates || "未填写"}\n`;
      text += `  📅 入住：${house.moveInDate || "未填写"}\n`;
      text += `  ⭐ 评分：${rating.toFixed(1)}分\n`;
      text += `  📝 预约时间：___________\n`;
      text += `  📞 联系方式：___________\n`;
      text += "\n";
    });

    text += "\n💡 看房前准备：\n";
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
    if (sortedHouses.length === 0) return "暂无候选房源";

    const topHouses = sortedHouses.slice(0, 5);

    let text = "🏆 最终候选列表\n";
    text += "=".repeat(30) + "\n";
    text += `（按综合评分排序，共${topHouses.length}套）\n\n`;

    topHouses.forEach((house, index) => {
      const rating = getTotalRating(house);
      const totalCost = house.rent + house.deposit / 12;
      const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

      text += `${medals[index]} 第${index + 1}名：${house.name || "未命名"}\n`;
      text += `   综合评分：⭐ ${rating.toFixed(1)}分\n`;
      text += `   月均成本：¥${Math.round(totalCost).toLocaleString()}\n`;
      text += `   通勤时间：${house.commuteTime || 0}分钟\n`;
      text += `   面积房型：${house.area || 0}㎡ · ${house.roomType || "未填写"}\n`;
      text += `   详细地址：${house.address || "未填写"}\n`;

      if (house.mapNotes && house.mapNotes.length > 0) {
        text += `   周边设施：${house.mapNotes.map((n) => n.name).join("、")}\n`;
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
          <h2 className="font-serif text-lg font-semibold text-gray-800">
            导出区
          </h2>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
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
