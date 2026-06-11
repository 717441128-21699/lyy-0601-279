import { useState } from "react";
import { useHouseStore } from "@/store/useHouseStore";
import { MAP_NOTE_CATEGORIES, type MapNote, type MapNoteCategory } from "@/types";
import { Plus, X, MapPin, ShoppingBag, Train, GraduationCap, Heart, Utensils, Tag } from "lucide-react";

const categoryIcons: Record<MapNoteCategory, typeof MapPin> = {
  business: ShoppingBag,
  subway: Train,
  school: GraduationCap,
  hospital: Heart,
  food: Utensils,
  other: Tag,
};

export default function MapNotes() {
  const { selectedHouseId, houses, updateHouse } = useHouseStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({
    category: "other" as MapNoteCategory,
    name: "",
    description: "",
  });

  const selectedHouse = houses.find((h) => h.id === selectedHouseId);
  const mapNotes = selectedHouse?.mapNotes || [];

  const handleAddNote = () => {
    if (!selectedHouseId || !newNote.name.trim()) return;

    const note: MapNote = {
      id: Math.random().toString(36).substring(2, 9),
      category: newNote.category,
      name: newNote.name.trim(),
      description: newNote.description.trim(),
    };

    updateHouse(selectedHouseId, {
      mapNotes: [...mapNotes, note],
    });

    setNewNote({ category: "other", name: "", description: "" });
    setIsAdding(false);
  };

  const handleDeleteNote = (noteId: string) => {
    if (!selectedHouseId) return;
    updateHouse(selectedHouseId, {
      mapNotes: mapNotes.filter((n) => n.id !== noteId),
    });
  };

  const getCategoryInfo = (category: MapNoteCategory) => {
    return MAP_NOTE_CATEGORIES.find((c) => c.value === category) || MAP_NOTE_CATEGORIES[5];
  };

  const groupedNotes = mapNotes.reduce((acc, note) => {
    if (!acc[note.category]) {
      acc[note.category] = [];
    }
    acc[note.category].push(note);
    return acc;
  }, {} as Record<MapNoteCategory, MapNote[]>);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-warm-100 overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-warm-100 bg-gradient-to-r from-accent-50 to-white">
        <h2 className="font-serif text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent-500" />
          位置备注
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedHouse ? selectedHouse.name : "请先选择房源"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!selectedHouse ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">请先选择一套房源</p>
            </div>
          </div>
        ) : mapNotes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">暂无位置备注</p>
              <p className="text-xs mt-1">记录周边的生活设施印象</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {MAP_NOTE_CATEGORIES.map((cat) => {
              const notes = groupedNotes[cat.value];
              if (!notes || notes.length === 0) return null;

              const IconComponent = categoryIcons[cat.value];

              return (
                <div key={cat.value}>
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className={`w-4 h-4 ${cat.color}`} />
                    <span className={`text-sm font-medium ${cat.color}`}>
                      {cat.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({notes.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {notes.map((note) => {
                      const catInfo = getCategoryInfo(note.category);
                      return (
                        <div
                          key={note.id}
                          className={`group relative px-3 py-1.5 rounded-full text-sm ${catInfo.bgColor} ${catInfo.color} flex items-center gap-1.5 animate-fade-in`}
                          title={note.description}
                        >
                          <span>{note.name}</span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-white/50 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedHouse && (
        <div className="p-4 border-t border-warm-100">
          {isAdding ? (
            <div className="space-y-3 animate-slide-up">
              <div className="flex flex-wrap gap-2">
                {MAP_NOTE_CATEGORIES.map((cat) => {
                  const IconComponent = categoryIcons[cat.value];
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setNewNote((n) => ({ ...n, category: cat.value }))}
                      className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-all ${
                        newNote.category === cat.value
                          ? `${cat.bgColor} ${cat.color} ring-2 ring-offset-1 ring-current`
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <IconComponent className="w-3 h-3" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={newNote.name}
                onChange={(e) => setNewNote((n) => ({ ...n, name: e.target.value }))}
                placeholder="名称，如：朝阳大悦城"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                autoFocus
              />
              <input
                type="text"
                value={newNote.description}
                onChange={(e) => setNewNote((n) => ({ ...n, description: e.target.value }))}
                placeholder="描述（可选），如：步行10分钟"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.name.trim()}
                  className="flex-1 py-2 rounded-lg bg-accent-500 text-white text-sm hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  添加
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-accent-200 text-accent-600 text-sm font-medium hover:bg-accent-50 hover:border-accent-300 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加位置备注
            </button>
          )}
        </div>
      )}
    </div>
  );
}
