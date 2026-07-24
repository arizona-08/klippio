import { Hand, MapPin, PanelRightClose, PanelRightOpen } from "lucide-react";
import React from "react";

export type SelectOption = "hand" | "pin" | "filter" | "add";
interface VisualizerMenuProps {
  option: SelectOption;
  selectOption: (option: SelectOption) => void;
  canEdit: boolean;
}

function VisualizerMenu({ option, selectOption, canEdit }: VisualizerMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(true);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  return (
    <aside className={`fixed bottom-5 right-5 z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-lg backdrop-blur transition-all duration-200 ${isMenuOpen ? "w-52" : "w-11"}`}>
      <div className="flex items-center justify-between border-b border-gray-100 px-2 py-2">
        {isMenuOpen && <p className="pl-2 text-xs font-semibold text-gray-500">OUTILS DU PLAN</p>}
        <button type="button" className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900" onClick={toggleMenu} aria-label={isMenuOpen ? "Réduire les outils" : "Afficher les outils"}>
          {isMenuOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </button>
      </div>
      {isMenuOpen && <div className="space-y-1 p-2">
        <button type="button" className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${option === "hand" ? "bg-primary text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`} onClick={() => selectOption("hand")}>
          <Hand className="h-4 w-4" /> Naviguer dans le plan
        </button>
        {canEdit && <button type="button" className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${option === "pin" ? "bg-primary text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`} onClick={() => selectOption("pin")}>
          <MapPin className="h-4 w-4" /> Ajouter un point
        </button>}
      </div>}
    </aside>
  );
}

export default VisualizerMenu;
