import { useState, useEffect } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import {
  ROOM_TYPE_OPTIONS,
  LEVEL_OPTIONS,
  HOUSE_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  UTILITY_TYPE_OPTIONS,
  LEASE_TERM_OPTIONS,
} from "@/types";
import type { HouseStatus } from "@/types";
import { Save, X, ChevronDown, ChevronUp } from "lucide-react";

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
    agencyFee: 0,
    movingFee: 0,
    commuteCostMonthly: 0,
    utilityEstimate: 0,
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
    viewingDate: "",
    viewingTime: "",
    contactName: "",
    contactPhone: "",
    viewingNotes: "",
    eliminateReason: "",
    shortlistReason: "",
    leaseTermMonths: 12,
    contractTerm: "",
    paymentMethod: "",
    propertyFee: 0,
    internetFee: 0,
    utilityType: "",
    maintenanceResponsibility: "",
    subletRule: "",
    reviewNotes: "",
    photoNotes: "",
    onSiteDeductions: "",
  });

  const [sections, setSections] = useState({
    cost: true,
    viewing: true,
    contract: false,
    review: false,
    condition: true,
  });

  useEffect(() => {
    if (existingHouse) {
      setFormData({
        name: existingHouse.name,
        address: existingHouse.address,
        rent: existingHouse.rent,
        deposit: existingHouse.deposit,
        agencyFee: existingHouse.agencyFee || 0,
        movingFee: existingHouse.movingFee || 0,
        commuteCostMonthly: existingHouse.commuteCostMonthly || 0,
        utilityEstimate: existingHouse.utilityEstimate || 0,
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
        viewingDate: existingHouse.viewingDate || "",
        viewingTime: existingHouse.viewingTime || "",
        contactName: existingHouse.contactName || "",
        contactPhone: existingHouse.contactPhone || "",
        viewingNotes: existingHouse.viewingNotes || "",
        eliminateReason: existingHouse.eliminateReason || "",
        shortlistReason: existingHouse.shortlistReason || "",
        leaseTermMonths: existingHouse.leaseTermMonths || 12,
        contractTerm: existingHouse.contractTerm || "",
        paymentMethod: existingHouse.paymentMethod || "",
        propertyFee: existingHouse.propertyFee || 0,
        internetFee: existingHouse.internetFee || 0,
        utilityType: existingHouse.utilityType || "",
        maintenanceResponsibility: existingHouse.maintenanceResponsibility || "",
        subletRule: existingHouse.subletRule || "",
        reviewNotes: existingHouse.reviewNotes || "",
        photoNotes: existingHouse.photoNotes || "",
        onSiteDeductions: existingHouse.onSiteDeductions || "",
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
        name === "rent" ||
        name === "deposit" ||
        name === "area" ||
        name === "commuteTime" ||
        name === "agencyFee" ||
        name === "movingFee" ||
        name === "commuteCostMonthly" ||
        name === "utilityEstimate" ||
        name === "propertyFee" ||
        name === "internetFee" ||
        name === "leaseTermMonths"
          ? Number(value) || 0
          : value,
    }));
  };

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SectionHeader = ({
    title,
    sectionKey,
    accent = "primary",
  }: {
    title: string;
    sectionKey: keyof typeof sections;
    accent?: "primary" | "accent" | "purple" | "amber";
  }) => {
    const colorMap = {
      primary: "from-primary-500 to-primary-600",
      accent: "from-accent-500 to-accent-600",
      purple: "from-purple-500 to-purple-600",
      amber: "from-amber-500 to-amber-600",
    };
    return (
      <div
        className={`col-span-2 mt-4 -mx-6 px-6 py-2.5 bg-gradient-to-r ${colorMap[accent]} cursor-pointer`}
        onClick={() => toggleSection(sectionKey)}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-white">{title}</div>
          {sections[sectionKey] ? (
            <ChevronUp className="w-4 h-4 text-white/80" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/80" />
          )}
        </div>
      </div>
    );
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

          <SectionHeader title="💰 费用与租期" sectionKey="cost" accent="primary" />
          {sections.cost && (
            <>
              <div className="col-span-2 mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">月租金（元）</label>
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent || ""}
                    onChange={handleChange}
                    placeholder="3000"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">押金（元）</label>
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit || ""}
                    onChange={handleChange}
                    placeholder="3000"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">中介费（元）</label>
                  <input
                    type="number"
                    name="agencyFee"
                    value={formData.agencyFee || ""}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">搬家费（元）</label>
                  <input
                    type="number"
                    name="movingFee"
                    value={formData.movingFee || ""}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">月通勤费（元）</label>
                  <input
                    type="number"
                    name="commuteCostMonthly"
                    value={formData.commuteCostMonthly || ""}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">水电网月均（元）</label>
                  <input
                    type="number"
                    name="utilityEstimate"
                    value={formData.utilityEstimate || ""}
                    onChange={handleChange}
                    placeholder="200"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">物业费（元/月）</label>
                  <input
                    type="number"
                    name="propertyFee"
                    value={formData.propertyFee || ""}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">网费（元/月）</label>
                  <input
                    type="number"
                    name="internetFee"
                    value={formData.internetFee || ""}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">租期（月）</label>
                  <select
                    name="leaseTermMonths"
                    value={formData.leaseTermMonths}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  >
                    {LEASE_TERM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <SectionHeader title="📅 看房记录" sectionKey="viewing" accent="purple" />
          {sections.viewing && (
            <>
              <div className="col-span-2 mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">看房日期</label>
                  <input
                    type="date"
                    name="viewingDate"
                    value={formData.viewingDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">看房时间</label>
                  <input
                    type="time"
                    name="viewingTime"
                    value={formData.viewingTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">联系人</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="房东/中介姓名"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">联系电话</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="138 xxxx xxxx"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5">看房结论</label>
                  <textarea
                    name="viewingNotes"
                    value={formData.viewingNotes}
                    onChange={handleChange}
                    placeholder="看完房子后的直观感受、和中介/房东聊了什么..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-white text-sm resize-none"
                  />
                </div>
                {formData.status === "shortlisted" && (
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1.5">入选理由</label>
                    <textarea
                      name="shortlistReason"
                      value={formData.shortlistReason}
                      onChange={handleChange}
                      placeholder="为什么把这套列入重点考虑？"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all bg-green-50/50 text-sm resize-none"
                    />
                  </div>
                )}
                {formData.status === "eliminated" && (
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1.5">淘汰原因</label>
                    <textarea
                      name="eliminateReason"
                      value={formData.eliminateReason}
                      onChange={handleChange}
                      placeholder="为什么不再考虑这套？"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all bg-red-50/50 text-sm resize-none"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <SectionHeader title="📝 签约前检查" sectionKey="contract" accent="amber" />
          {sections.contract && (
            <>
              <div className="col-span-2 mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">合同期限</label>
                  <input
                    type="text"
                    name="contractTerm"
                    value={formData.contractTerm}
                    onChange={handleChange}
                    placeholder="如：一年一签"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">付款方式</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all bg-white text-sm"
                  >
                    <option value="">请选择</option>
                    {PAYMENT_METHOD_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">水电类型</label>
                  <select
                    name="utilityType"
                    value={formData.utilityType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all bg-white text-sm"
                  >
                    <option value="">请选择</option>
                    {UTILITY_TYPE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">维修责任</label>
                  <input
                    type="text"
                    name="maintenanceResponsibility"
                    value={formData.maintenanceResponsibility}
                    onChange={handleChange}
                    placeholder="如：自然老化房东负责"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all bg-white text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5">转租规则</label>
                  <textarea
                    name="subletRule"
                    value={formData.subletRule}
                    onChange={handleChange}
                    placeholder="能否转租？是否需要手续费？提前多久通知？"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all bg-white text-sm resize-none"
                  />
                </div>
              </div>
            </>
          )}

          <SectionHeader title="🔍 看房复盘" sectionKey="review" accent="accent" />
          {sections.review && (
            <>
              <div className="col-span-2 mt-3 grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">真实感受</label>
                  <textarea
                    name="reviewNotes"
                    value={formData.reviewNotes}
                    onChange={handleChange}
                    placeholder="实际看完后的整体感受，和网上图片差距大吗？"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition-all bg-white text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">照片备注</label>
                  <textarea
                    name="photoNotes"
                    value={formData.photoNotes}
                    onChange={handleChange}
                    placeholder="拍了哪些照片？分别对应什么位置/问题？"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition-all bg-white text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">临场扣分原因</label>
                  <textarea
                    name="onSiteDeductions"
                    value={formData.onSiteDeductions}
                    onChange={handleChange}
                    placeholder="现场发现了哪些问题让你减分了？"
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all bg-red-50/30 text-sm resize-none"
                  />
                </div>
              </div>
            </>
          )}

          <SectionHeader title="🏠 房屋条件评估" sectionKey="condition" accent="primary" />
          {sections.condition && (
            <>
              <div className="col-span-2 mt-3 grid grid-cols-2 gap-4">
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
            </>
          )}
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
