import { useRef, useState } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import {
  Download,
  Upload,
  Check,
  AlertCircle,
  Database,
} from "lucide-react";

export default function DataManager() {
  const { exportData, importData, houses, weights, filterPresets } = useHouseStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const showStatus = (type: "success" | "error", message: string) => {
    setStatus(type);
    setStatusMessage(message);
    setTimeout(() => {
      setStatus("idle");
      setStatusMessage("");
    }, 3000);
  };

  const handleExport = () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `租房对比数据_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showStatus("success", "数据导出成功！");
    } catch {
      showStatus("error", "导出失败，请重试");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const success = importData(data);

      if (success) {
        const houseCount = data.houses?.length || 0;
        showStatus("success", `成功导入 ${houseCount} 套房源数据！`);
      } else {
        showStatus("error", "文件格式不正确");
      }
    } catch {
      showStatus("error", "文件解析失败，请确保是有效的 JSON 文件");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
          <Database className="w-4 h-4 text-accent-600" />
        </div>
        <div>
          <h3 className="font-serif text-base font-semibold text-gray-800">
            数据管理
          </h3>
          <p className="text-xs text-gray-500">
            当前 {houses.length} 套房源，支持跨浏览器迁移
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-medium hover:from-accent-600 hover:to-accent-700 transition-all shadow-md shadow-accent-200"
        >
          <Download className="w-4 h-4" />
          导出数据
        </button>
        <button
          onClick={handleImportClick}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-accent-200 text-accent-600 text-sm font-medium hover:bg-accent-50 transition-all"
        >
          <Upload className="w-4 h-4" />
          导入数据
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs text-gray-500">
        <div className="px-2 py-1.5 rounded-lg bg-warm-50 text-center">
          房源: <span className="font-medium text-gray-700">{houses.length}</span>
        </div>
        <div className="px-2 py-1.5 rounded-lg bg-warm-50 text-center">
          方案: <span className="font-medium text-gray-700">{filterPresets.length}</span>
        </div>
        <div className="px-2 py-1.5 rounded-lg bg-warm-50 text-center">
          权重:{" "}
          <span className="font-medium text-gray-700">
            {weights.safety}/{weights.valueForMoney}/{weights.convenience}/
            {weights.comfort}
          </span>
        </div>
      </div>

      {status !== "idle" && (
        <div
          className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm animate-fade-in ${
            status === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {status === "success" ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
