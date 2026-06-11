export type MapNoteCategory =
  | "business"
  | "subway"
  | "school"
  | "hospital"
  | "food"
  | "other";

export interface MapNote {
  id: string;
  category: MapNoteCategory;
  name: string;
  description: string;
}

export interface Ratings {
  safety: number;
  valueForMoney: number;
  convenience: number;
  comfort: number;
}

export interface Weights {
  safety: number;
  valueForMoney: number;
  convenience: number;
  comfort: number;
}

export type HouseStatus =
  | "pending"
  | "contacted"
  | "scheduled"
  | "viewed"
  | "eliminated"
  | "shortlisted";

export interface FilterConditions {
  rentMin: number | null;
  rentMax: number | null;
  commuteMax: number | null;
  roomType: string;
  moveInDateBefore: string;
  status: HouseStatus | "";
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: FilterConditions;
}

export interface House {
  id: string;
  name: string;
  address: string;
  rent: number;
  deposit: number;
  agencyFee: number;
  movingFee: number;
  commuteCostMonthly: number;
  utilityEstimate: number;
  area: number;
  roomType: string;
  commuteTime: number;
  roommates: string;
  moveInDate: string;
  lighting: string;
  noise: string;
  facilities: string;
  riskNotes: string;
  mapNotes: MapNote[];
  ratings: Ratings;
  status: HouseStatus;
  viewingDate: string;
  viewingTime: string;
  contactName: string;
  contactPhone: string;
  viewingNotes: string;
  eliminateReason: string;
  shortlistReason: string;
  leaseTermMonths: number;
  contractTerm: string;
  paymentMethod: string;
  propertyFee: number;
  internetFee: number;
  utilityType: string;
  maintenanceResponsibility: string;
  subletRule: string;
  reviewNotes: string;
  photoNotes: string;
  onSiteDeductions: string;
  createdAt: string;
  updatedAt: string;
}

export type SortField =
  | "totalCost"
  | "commuteTime"
  | "lighting"
  | "noise"
  | "facilities"
  | "riskNotes"
  | "rating";

export type SortOrder = "asc" | "desc";

export const MAP_NOTE_CATEGORIES: {
  value: MapNoteCategory;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  { value: "business", label: "商圈", color: "text-primary-600", bgColor: "bg-primary-100" },
  { value: "subway", label: "地铁", color: "text-accent-600", bgColor: "bg-accent-100" },
  { value: "school", label: "学校", color: "text-blue-600", bgColor: "bg-blue-100" },
  { value: "hospital", label: "医院", color: "text-red-600", bgColor: "bg-red-100" },
  { value: "food", label: "美食", color: "text-orange-600", bgColor: "bg-orange-100" },
  { value: "other", label: "其他", color: "text-gray-600", bgColor: "bg-gray-100" },
];

export const RATING_DIMENSIONS: {
  key: keyof Ratings;
  label: string;
  icon: string;
}[] = [
  { key: "safety", label: "安全性", icon: "shield" },
  { key: "valueForMoney", label: "性价比", icon: "dollar-sign" },
  { key: "convenience", label: "便利度", icon: "map-pin" },
  { key: "comfort", label: "舒适度", icon: "home" },
];

export const LEVEL_OPTIONS = ["优秀", "良好", "一般", "较差", "很差"];

export const ROOM_TYPE_OPTIONS = [
  "主卧独卫",
  "主卧公卫",
  "次卧",
  "单间",
  "整租一居",
  "整租两居",
  "整租三居",
];

export const DEFAULT_WEIGHTS: Weights = {
  safety: 25,
  valueForMoney: 25,
  convenience: 25,
  comfort: 25,
};

export const DEFAULT_FILTERS: FilterConditions = {
  rentMin: null,
  rentMax: null,
  commuteMax: null,
  roomType: "",
  moveInDateBefore: "",
  status: "",
};

export const HOUSE_STATUS_OPTIONS: {
  value: HouseStatus;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  { value: "pending", label: "待联系", color: "text-gray-600", bgColor: "bg-gray-100" },
  { value: "contacted", label: "已联系", color: "text-blue-600", bgColor: "bg-blue-100" },
  { value: "scheduled", label: "已预约", color: "text-purple-600", bgColor: "bg-purple-100" },
  { value: "viewed", label: "已看房", color: "text-accent-600", bgColor: "bg-accent-100" },
  { value: "eliminated", label: "已淘汰", color: "text-red-600", bgColor: "bg-red-100" },
  { value: "shortlisted", label: "重点考虑", color: "text-green-600", bgColor: "bg-green-100" },
];

export const PAYMENT_METHOD_OPTIONS = [
  "押一付一",
  "押一付三",
  "押一付六",
  "押一付十二",
  "押二付一",
  "押二付三",
  "半年付",
  "年付",
];

export const UTILITY_TYPE_OPTIONS = [
  "民水民电",
  "商水商电",
  "民水商电",
  "商水民电",
  "混合计费",
];

export const LEASE_TERM_OPTIONS = [
  { value: 3, label: "3个月" },
  { value: 6, label: "6个月" },
  { value: 12, label: "1年" },
  { value: 24, label: "2年" },
  { value: 36, label: "3年" },
];
