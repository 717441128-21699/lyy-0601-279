import { useState, useEffect } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import { ROOM_TYPE_OPTIONS, LEVEL_OPTIONS, HOUSE_STATUS_OPTIONS } from "@/types";
import type { HouseStatus } from "@/types";
import { Save, X } from "lucide-react";

interface HouseFormProps {
  houseId: string | null;
  onClose: () => void;
}

export default function HouseForm({ houseId, onClose }: HouseFormProps) {
  const { houses, addHouse, updateHouse } = useHouseStore();
  const isEditing = !!houseId;
  const existingHouse = houses.find((h) => h.id === houseId);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    rent: 0,
    deposit: 0,
    area: 0,
    roomType: "",
    commuteTime: 0,
    roommates: "",
    moveInDate: "",
    lighting: "一般",
    noise: "一般",
    facilities: "一般",
    riskNotes: "一般",
    status: "pending" as HouseStatus,
  });

  useEffect(() => {
    if (existingHouse) {
      setFormData({
        name: existingHouse.name,
        address: existingHouse.address,
        rent: existingHouse.rent,
        deposit: existingHouse.deposit,
        area: existingHouse.area,
        roomType: existingHouse.roomType,
        commuteTime: existingHouse.commuteTime,
        roommates: existingHouse.roommates,
        moveInDate: existingHouse.moveInDate,
        lighting: existingHouse.lighting || "一般",
        noise: existingHouse.noise || "一般",
        facilities: existingHouse.facilities || "一般",
        riskNotes: existingHouse.riskNotes || "一般",
        status: existingHouse.status || "pending",
      });
    }
  }, [existingHouse]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rent" || name === "deposit" || name === "area" || name === "commuteTime"
          ? Number(value) || 0
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && houseId) {
      updateHouse(houseId, formData);
    } else {
      addHouse({
        ...formData,
        mapNotes: [],
        ratings: { safety: 3, valueForMoney: 3, convenience: 3, comfort: 3 },
      });
    }
    onClose();
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 overflow-hidden animate-scale-in">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-white">
            {isEditing ? "编辑房源" : "添加房源"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              房源名称
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例如：阳光花园主卧"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              详细地址
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="例如：北京市朝阳区xx小区xx号楼"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              月租金（元）
            </label>
            <input
              type="number"
              name="rent"
              value={formData.rent || ""}
              onChange={handleChange}
              placeholder="3000"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              押金（元）
            </label>
            <input
              type="number"
              name="deposit"
              value={formData.deposit || ""}
              onChange={handleChange}
              placeholder="3000"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              面积（㎡）
            </label>
            <input
              type="number"
              name="area"
              value={formData.area || ""}
              onChange={handleChange}
              placeholder="15"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              房型
            </label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white"
            >
              <option value="">请选择房型</option>
              {ROOM_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              通勤时间（分钟）
            </label>
            <input
              type="number"
              name="commuteTime"
              value={formData.commuteTime || ""}
              onChange={handleChange}
              placeholder="30"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              可入住日期
            </label>
            <input
              type="date"
              name="moveInDate"
              value={formData.moveInDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              室友情况
            </label>
            <input
              type="text"
              name="roommates"
              value={formData.roommates}
              onChange={handleChange}
              placeholder="例如：2位女生室友，安静爱干净"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="col-span-2 mt-2">
            <div className="text-sm font-medium text-gray-700 mb-3">看房跟进状态</div>
            <div className="flex flex-wrap gap-2">
              {HOUSE_STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: opt.value }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    formData.status === opt.value
                      ? `${opt.bgColor} ${opt.color} ring-2 ring-current ring-offset-1`
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2 mt-2">
            <div className="text-sm font-medium text-gray-700 mb-3">房屋条件评估</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">采光</label>
                <select
                  name="lighting"
                  value={formData.lighting}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                >
                  {LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">噪音</label>
                <select
                  name="noise"
                  value={formData.noise}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                >
                  {LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">设施</label>
                <select
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                >
                  {LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">风险</label>
                <select
                  name="riskNotes"
                  value={formData.riskNotes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                >
                  {LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
          >
            <Save className="w-4 h-4" />
            {isEditing ? "保存修改" : "添加房源"}
          </button>
        </div>
      </form>
    </div>
  );
}
