import { useState } from "react";
import HouseList from "@/components/HouseList";
import HouseForm from "@/components/HouseForm";
import CompareTable from "@/components/CompareTable";
import MapNotes from "@/components/MapNotes";
import RatingCard from "@/components/RatingCard";
import ExportPanel from "@/components/ExportPanel";
import { Home as HomeIcon, Sparkles } from "lucide-react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [editingHouseId, setEditingHouseId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingHouseId(null);
    setShowForm(true);
  };

  const handleEdit = (houseId: string) => {
    setEditingHouseId(houseId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHouseId(null);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-md border-b border-warm-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-200">
                <HomeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-gray-800">
                  租房对比助手
                </h1>
                <p className="text-xs text-gray-500">轻松挑选最合适的合租房</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span>数据自动保存在浏览器中</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {showForm ? (
              <HouseForm
                houseId={editingHouseId}
                onClose={handleCloseForm}
              />
            ) : (
              <HouseList onAdd={handleAdd} onEdit={handleEdit} />
            )}
            <RatingCard />
          </div>

          <div className="col-span-12 lg:col-span-6 space-y-6">
            <CompareTable />
            <ExportPanel />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <MapNotes />
          </div>
        </div>
      </main>

      <footer className="mt-12 pb-6 text-center text-sm text-gray-400">
        <p>🏠 愿你找到心仪的小窝</p>
      </footer>
    </div>
  );
}
