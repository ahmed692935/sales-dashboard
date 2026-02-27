import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Paperclip,
  SmilePlus,
  SquarePen,
  Type,
  Send,
  Plus,
  Pencil,
  MessageSquare,
  Hash,
  Phone,
  MapPin,
  Check,
  Circle,
  Info,
  ChevronLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivePanel = "list" | "chat" | "detail";

interface Contact {
  id: string;
  name: string;
  phone: string;
  badge: string;
  time: string;
  unread: number;
}

interface Message {
  id: string;
  text: string;
  sender: "agent" | "contact";
  time: string;
  isSystem?: boolean;
  isDateDivider?: boolean;
}

interface JourneyStep {
  label: string;
  description: string;
  completed: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const contacts: Contact[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: "Person 1",
  phone: "+92 300 1234567",
  badge: "application submitted",
  time: "6:15 pm",
  unread: 1,
}));

const initialMessages: Message[] = [
  {
    id: "sys1",
    text: "The ticket status has been set as solved by Member 2:55:29 AM",
    sender: "agent",
    time: "",
    isSystem: true,
  },
  {
    id: "1",
    text: "Box office: 36,870\nNumber of incoming: 2,346\nConversion: 89%\nSales 67\nThe number of checks is 56",
    sender: "contact",
    time: "Friday 4:55pm",
  },
  {
    id: "2",
    text: "I promise that by the evening there will be better results, we are fulfilling the plan!!!",
    sender: "contact",
    time: "Friday 6:15pm",
  },
  {
    id: "3",
    text: "Sure thing, I'll have a look today.",
    sender: "agent",
    time: "Friday 8:20pm",
  },
  {
    id: "divider",
    text: "Today",
    sender: "contact",
    time: "",
    isDateDivider: true,
  },
  {
    id: "4",
    text: "I promise that by the evening there will be better results, we are fulfilling the plan!!!",
    sender: "contact",
    time: "Friday 6:15pm",
  },
];

const journeySteps: JourneyStep[] = [
  { label: "Step Name", description: "Step Description", completed: true },
  { label: "Step Name", description: "Step Description", completed: false },
];

const tags = ["Tag 1", "Tag 2"];
const customFields = ["Tag 1", "Tag 2"];

// ─── Left Panel — Contact List ────────────────────────────────────────────────

const ContactList = ({
  activeId,
  onSelect,
  onClose,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  onClose?: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<"Newest" | "Lead" | "Application">(
    "Newest",
  );
  const tabs = ["Newest", "Lead", "Application Submitt..."] as const;

  return (
    <aside className="flex flex-col bg-white h-full border-r border-slate-200 w-full md:w-60 lg:w-68 xl:70 shrink-0">
      {/* Close */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={15} />
          <span className="text-sm font-medium">Close</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <Search size={13} className="text-slate-600 shrink-0" />
          <input
            type="text"
            placeholder="Search chat"
            className="flex-1 bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none min-w-0"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-2 py-1.5 border-b border-slate-100 gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(
                tab === "Application Submitt..."
                  ? "Application"
                  : (tab as "Newest" | "Lead"),
              )
            }
            className={`text-[11px] font-medium px-1.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
              (tab === "Newest" && activeTab === "Newest") ||
              (tab === "Lead" && activeTab === "Lead") ||
              (tab === "Application Submitt..." && activeTab === "Application")
                ? "text-slate-800 font-semibold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
        <button className="ml-auto text-slate-400 hover:text-slate-600 shrink-0">
          <SlidersHorizontal size={13} />
        </button>
      </div>

      {/* Contact Items */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full flex items-start gap-2.5 px-3 py-2.5 border-b border-slate-50 text-left transition-colors ${
              activeId === c.id ? "bg-slate-50" : "hover:bg-slate-50"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
              D
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[12px] font-semibold text-slate-800 truncate">
                  {c.name}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {c.time}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {c.phone}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] bg-teal-500 text-white px-1.5 py-0.5 rounded-full font-medium truncate max-w-[100px]">
                  {c.badge}
                </span>
                <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                  {c.unread}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

// ─── Center Panel — Chat View ─────────────────────────────────────────────────

const ChatView = ({
  onBack,
  onShowDetail,
}: {
  onBack?: () => void;
  onShowDetail?: () => void;
}) => {
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>(initialMessages);

  const handleSend = () => {
    if (!messageText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        text: messageText,
        sender: "agent",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMessageText("");
  };

  return (
    <main className="flex-1 flex flex-col border- border-gray-100 border-4 overflow-hidden bg-white min-w-0">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-200 shrink-0">
        <div className="flex items-start justify-between gap-2">
          {/* Left */}
          <div className="flex items-start gap-2 min-w-0">
            {/* Back button — mobile only */}
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden mt-0.5 text-slate-500 hover:text-slate-700 shrink-0"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-slate-800 whitespace-nowrap">
                  Nataly Chaplack
                </h2>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Assignee
                </span>
                <span className="text-xs font-semibold text-violet-600 cursor-pointer hidden sm:inline">
                  John Doe
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">+92 300 1234567</p>
              <span className="inline-block mt-1 text-[10px] bg-teal-100 text-teal-700 font-semibold px-2 py-0.5 rounded-full">
                lead stages
              </span>
            </div>
          </div>

          {/* Right — dropdowns + detail toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Dropdowns hidden on small, shown md+ */}
            <div className="hidden md:flex items-center gap-1.5">
              {["Select Stage", "Assign to", "Open"].map((label) => (
                <button
                  key={label}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  {label} <ChevronDown size={11} />
                </button>
              ))}
            </div>
            {/* Info icon — opens detail on mobile/tablet */}
            {onShowDetail && (
              <button
                onClick={onShowDetail}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-800 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Info size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Dropdowns row for small screens */}
        <div className="flex md:hidden items-center gap-1.5 mt-2 overflow-x-auto">
          {["Select Stage", "Assign to", "Open"].map((label) => (
            <button
              key={label}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 whitespace-nowrap shrink-0"
            >
              {label} <ChevronDown size={10} />
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-gray-100 flex flex-col gap-4">
        {chatMessages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-[11px] text-violet-500 bg-violet-50 px-4 py-1.5 rounded-full text-center">
                  {msg.text}
                </span>
              </div>
            );
          }
          if (msg.isDateDivider) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-[11px] text-slate-400 border border-slate-200 bg-white px-4 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isAgent = msg.sender === "agent";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  isAgent
                    ? "bg-violet-600 text-white rounded-br-sm"
                    : "bg-white text-slate-700 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
              {msg.time && (
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.time}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="border-t border-slate-200 bg-white shrink-0">
        <div className="px-4 pt-3 pb-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message"
            className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent"
          />
        </div>
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Paperclip size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <SmilePlus size={16} />
            </button>
            <button className="hidden sm:block text-slate-400 hover:text-slate-600 transition-colors">
              <SquarePen size={16} />
            </button>
            <button className="hidden sm:block text-slate-400 hover:text-slate-600 transition-colors">
              <Type size={16} />
            </button>
          </div>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            Send <Send size={13} />
          </button>
        </div>
      </div>
    </main>
  );
};

// ─── Right Panel — Detail ─────────────────────────────────────────────────────

const DetailPanel = ({ onBack }: { onBack?: () => void }) => {
  const [note, setNote] = useState("");

  const detailRows = [
    {
      icon: <MessageSquare size={13} />,
      label: "Channel",
      value: "WhatsAppB2B",
    },
    { icon: <Hash size={13} />, label: "ID", value: "2023113142356" },
    {
      icon: <Phone size={13} />,
      label: "Phone num..",
      value: "+92 300 1234567",
    },
    {
      icon: <MapPin size={13} />,
      label: "Address",
      value: "house no 1 street , colony, Landmark, City ........",
    },
  ];

  return (
    <aside className="bg-white border-l border-4 border-gray-100 flex flex-col overflow-y-auto w-full lg:w-68 xl:w-70 shrink-0 h-full">
      {/* Mobile back bar */}
      {onBack && (
        <div className="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700"
          >
            <ChevronLeft size={15} />
            <span className="text-sm font-medium">Back to chat</span>
          </button>
        </div>
      )}

      {/* Person Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          P
        </div>
        <span className="flex-1 text-sm font-semibold text-slate-800">
          Person 1
        </span>
        <button className="flex items-center gap-1 text-[12px] text-black hover:text-slate-700">
          <Pencil size={11} /> Edit
        </button>
      </div>

      {/* Detail Rows */}
      <div className="px-4 py-4 rounded-md">
        {detailRows.map((row) => (
          <div key={row.label} className="flex py-2">
            {/* Left Side (Icon + Label) */}
            <div className="flex items-center gap-2 w-28 shrink-0">
              <span className="text-slate-700">{row.icon}</span>
              <span className="text-xs text-black">{row.label}</span>
            </div>

            {/* Right Side (Value) */}
            <div className="flex-1 min-w-0 text-xs text-black break-words">
              {row.value}
            </div>
          </div>
        ))}
      </div>

      {/* Add Attribute */}
      <div className="px-4 py-2.5 border-b border-slate-100">
        <button className="flex items-center gap-1.5 text-[11px] text-black hover:text-slate-600">
          <Plus size={13} /> Add new attribute
        </button>
      </div>

      {/* Tags */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold text-black">Tags</span>
          <button className="text-black hover:text-slate-600">
            <Plus size={13} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-1">
          {tags.map((t) => (
            <span
              key={t}
              className="text-[11px] bg-transparent border border-gray-300 text-slate-600 px-4  py-0.5 rounded-lg font-medium"
            >
              {t}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-slate-600">No tags Added</p>
      </div>

      {/* Custom User Fields */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold text-black">
            Custom User Fields
          </span>
          <button className="text-black hover:text-slate-600">
            <Plus size={13} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-1">
          {customFields.map((f) => (
            <span
              key={f}
              className="text-[10px] bg-transparent text-black px-4 py-0.5 rounded-lg border border-gray-300 font-medium"
            >
              {f}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-slate-600">No custom field added</p>
      </div>

      {/* Notes */}
      <div className="px-4 py-3 border-b border-slate-100">
        <span className="text-[13px] font-semibold text-black block mb-2">
          Notes
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a note..."
          rows={3}
          className="w-full text-[11px] text-slate-700 placeholder-slate-400 focus:outline-none resize-none bg-gray-100 p-2 rounded-lg"
        />
        <div className="flex items-center gap-2 mt-1">
          <button className="text-slate-500 hover:text-slate-500">
            <Paperclip size={13} />
          </button>
          <button className="text-slate-500 hover:text-slate-500">
            <SmilePlus size={13} />
          </button>
        </div>
      </div>

      {/* Client Journey */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-semibold text-black">
            Client Journey
          </span>
          <button className="text-black hover:text-slate-600">
            <Plus size={13} />
          </button>
        </div>
        <div className="flex flex-col">
          {journeySteps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                {step.completed ? (
                  <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                    <Check size={9} className="text-white" />
                  </div>
                ) : (
                  <Circle size={16} className="text-slate-300 shrink-0" />
                )}
                {i < journeySteps.length - 1 && (
                  <div
                    className="w-px flex-1 bg-slate-200 my-1"
                    style={{ minHeight: 24 }}
                  />
                )}
              </div>
              <div className="pb-4">
                <p className="text-[12px] font-semibold text-slate-700">
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-500">{step.description}</p>
                {step.completed && (
                  <span className="text-[10px] text-green-600 font-semibold">
                    Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const TeamInbox = () => {
  const [activeContactId, setActiveContactId] = useState("1");
  // Mobile panel navigation: "list" → "chat" → "detail"
  const [activePanel, setActivePanel] = useState<ActivePanel>("list");

  const handleSelectContact = (id: string) => {
    setActiveContactId(id);
    setActivePanel("chat");
  };

  return (
    <div className="flex flex-1 overflow-hidden w-full h-full">
      {/* ── Mobile: show one panel at a time ─────────────────────────────── */}
      <div className="flex flex-1 lg:hidden overflow-hidden">
        {activePanel === "list" && (
          <ContactList
            activeId={activeContactId}
            onSelect={handleSelectContact}
            onClose={() => {}} // no-op on mobile
          />
        )}
        {activePanel === "chat" && (
          <ChatView
            onBack={() => setActivePanel("list")}
            onShowDetail={() => setActivePanel("detail")}
          />
        )}
        {activePanel === "detail" && (
          <DetailPanel onBack={() => setActivePanel("chat")} />
        )}
      </div>

      {/* ── Desktop: all 3 panels side by side ────────────────────────────── */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <ContactList
          activeId={activeContactId}
          onSelect={(id) => setActiveContactId(id)}
          onClose={() => {}}
        />
        <ChatView />
        <DetailPanel />
      </div>
    </div>
  );
};

export default TeamInbox;
