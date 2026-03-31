import type { AutomationAction } from "../../types";
import { AUTOMATION_ACTIONS } from "./AutomationActions";

interface Props {
  activeId: string;
  onChange: (action: AutomationAction) => void;
}

const AutomationsSecondSidebar = ({ activeId, onChange }: Props) => (
  <aside className="w-full sm:w-52 shrink-0 bg-white border-r border-slate-200 flex flex-col sm:min-h-full">
    <nav className="flex flex-col gap-0.5 p-3">
      {AUTOMATION_ACTIONS.map((action) => {
        const Icon = action.icon;
        const isActive = activeId === action.id;

        return (
          <button
            key={action.id}
            type="button"
            onClick={() => onChange(action)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
              isActive
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isActive ? "bg-white/20" : "bg-slate-100"
              }`}
            >
              <Icon
                size={15}
                className={isActive ? "text-white" : "text-slate-500"}
              />
            </div>
            <span
              className={`text-sm font-medium leading-tight ${
                isActive ? "text-white" : "text-slate-700"
              }`}
            >
              {action.label}
            </span>
          </button>
        );
      })}
    </nav>
  </aside>
);

export default AutomationsSecondSidebar;
