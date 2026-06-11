import { useHouseStore } from "@/store/useHouseStore";
import { Plus, Trash2, Edit3, Home as HomeIcon } from "lucide-react";

interface HouseListProps {
  onAdd: () => void;
  onEdit: (houseId: string) => void;
}

export default function HouseList({ onAdd, onEdit }: HouseListProps) {
  const { houses, selectedHouseId, setSelectedHouse, deleteHouse, getTotalRating } =
    useHouseStore();

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 border border-warm-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-semibold text-gray-800">
          房源列表
        </h3>
        <span className="text-sm text-gray-500">
          共 {houses.length} 套
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {houses.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <HomeIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无房源，点击下方按钮添加</p>
          </div>
        ) : (
          houses.map((house) => (
            <div
              key={house.id}
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                selectedHouseId === house.id
                  ? "bg-primary-50 border-2 border-primary-300 shadow-sm"
                  : "bg-warm-50/50 border-2 border-transparent hover:bg-warm-100/50"
              }`}
              onClick={() => setSelectedHouse(house.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">
                    {house.name || "未命名房源"}
                  </h4>
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {house.address || "暂无地址"}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="font-semibold text-primary-600">
                      ¥{house.rent?.toLocaleString() || 0}/月
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">
                      {house.area || 0}㎡
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-accent-600 font-medium">
                      {getTotalRating(house).toFixed(1)}分
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(house.id);
                    }}
                    title="编辑"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("确定要删除这套房源吗？")) {
                        deleteHouse(house.id);
                      }
                    }}
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onAdd}
        className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-primary-200 text-primary-600 font-medium hover:bg-primary-50 hover:border-primary-300 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        添加房源
      </button>
    </div>
  );
}
