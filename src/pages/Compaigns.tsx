import { useState } from "react";
import {
  ChevronDown,
  Search,
  RefreshCw,
  Upload,
  Plus,
  Check,
  CheckCheck,
  Eye,
  CornerUpLeft,
  Send,
  AlertCircle,
  Layers,
  ArrowLeft,
  Filter,
  ChevronUp,
  Info,
  Calendar,
  ChevronRight,
  ChevronLeft,
  BarChart2,
  Circle,
  Zap,
  Shield,
  Trash2,
  Pencil,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Campaign {
  id: string;
  name: string;
  template: string;
  recipients: number;
  successful: number;
  read: number;
  replied: number;
  status: "Sent" | "Scheduled" | "Draft" | "Failed";
  clicks: number;
  date: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const TEMPLATES = [
  "greeting_message_start_chat",
  "task_assign_reminder",
  "dc_feedback_new",
  "confirmation_text",
  "calendly_confirmation_text",
  "talk_to_conseler",
  "order_update_notify",
  "welcome_new_user",
];

const CONTACTS = [
  { id: "1", name: "!", phone: "923330957420", allow: true },
  { id: "2", name: "!!!!!!!!!!!!!!!!!!!", phone: "923419760000", allow: true },
  { id: "3", name: '"MURSHAD"', phone: "923134286558", allow: true },
  { id: "4", name: '"❤"', phone: "923079707660", allow: true },
  { id: "5", name: "#@ΣΣ@|) @#", phone: "923125669925", allow: true },
];

const FILTER_CHIPS = [
  { label: "Highly engaged", count: 222, emoji: "🤩" },
  { label: "Winback", count: 1264, emoji: "🚨" },
  { label: "At Risk", count: 6235, emoji: "😤" },
  { label: "All valid", count: 3398, emoji: "✅" },
];

const STATUS_STYLE: Record<Campaign["status"], string> = {
  Sent: "bg-green-100 text-green-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Draft: "bg-slate-100 text-slate-600",
  Failed: "bg-red-100 text-red-600",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
    <div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
        {label} <Info size={11} className="text-slate-400" />
      </p>
    </div>
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center ${color}`}
    >
      <Icon size={16} />
    </div>
  </div>
);

// ─── Phone Preview ────────────────────────────────────────────────────────────
const PhonePreview = () => (
  <div className="flex flex-col items-center">
    <p className="text-xs font-semibold text-slate-600 mb-3 self-start">
      Preview
    </p>
    <div className="w-52 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-800 flex flex-col">
      <div className="bg-slate-800 px-4 py-1.5 flex items-center justify-between">
        <span className="text-[9px] text-white font-medium">11:14</span>
        <div className="flex items-center gap-1">
          <BarChart2 size={9} className="text-white" />
          <span className="text-[9px] text-white">📶</span>
        </div>
      </div>
      <div className="bg-[#075e54] px-3 py-2.5 flex items-center gap-2">
        <ChevronLeft size={16} className="text-white" />
        <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-[10px] font-bold text-white">
          W
        </div>
        <div className="flex-1">
          <p className="text-white text-[11px] font-semibold leading-none">
            Wati
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-green-300 text-[9px]">online</span>
          </div>
        </div>
        <span className="text-white text-[11px]">⋮</span>
      </div>
      <div className="bg-[#ece5dd] flex-1 min-h-[260px] px-2 py-3 flex flex-col gap-2">
        <div className="bg-[#fffde7] border border-yellow-200 rounded-lg px-2 py-1.5 text-[8.5px] text-slate-600 text-center leading-relaxed">
          🔒 This business uses a secure service from Meta to manage this chat.
          Tap to learn more
        </div>
        <div className="self-center">
          <span className="text-[8px] text-slate-500 bg-white/70 px-2 py-0.5 rounded-full">
            16:27
          </span>
        </div>
      </div>
      <div className="bg-[#f0f0f0] px-2 py-2 flex items-center gap-2">
        <Plus size={14} className="text-slate-500" />
        <div className="flex-1 bg-white rounded-full px-3 py-1">
          <span className="text-[9px] text-slate-300">Message</span>
        </div>
        <span className="text-[11px]">🎤</span>
      </div>
    </div>
  </div>
);

// ─── Overview Page ────────────────────────────────────────────────────────────
const OverviewPage = ({
  campaigns,
  onNew,
  onDelete,
}: {
  campaigns: Campaign[];
  onNew: () => void;
  onDelete: (id: string) => void;
}) => {
  const [sampleData, setSampleData] = useState(false);
  const [tableSearch, setTableSearch] = useState("");

  const stats = [
    {
      label: "Sent",
      value: campaigns.length,
      icon: Check,
      color: "bg-green-50 text-green-500",
    },
    {
      label: "Delivered",
      value: 0,
      icon: CheckCheck,
      color: "bg-green-50 text-green-500",
    },
    { label: "Read", value: 0, icon: Eye, color: "bg-teal-50 text-teal-500" },
    {
      label: "Replied",
      value: 0,
      icon: CornerUpLeft,
      color: "bg-violet-50 text-violet-500",
    },
    {
      label: "Sending",
      value: 0,
      icon: Send,
      color: "bg-blue-50 text-blue-500",
    },
    {
      label: "Failed",
      value: 0,
      icon: AlertCircle,
      color: "bg-red-50 text-red-400",
    },
    {
      label: "Processing",
      value: 0,
      icon: RefreshCw,
      color: "bg-orange-50 text-orange-400",
    },
    {
      label: "Queued",
      value: 0,
      icon: Layers,
      color: "bg-slate-100 text-slate-500",
    },
  ];

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.template.toLowerCase().includes(tableSearch.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-slate-800">Campaigns</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={onNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Plus size={14} /> New Campaign
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-5 flex flex-col gap-6">
        {/* Filters row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-bold text-slate-700">Overview</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Last 7 days <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Calendar size={12} /> 09 March 2026 <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Calendar size={12} /> 16 March 2026 <ChevronDown size={12} />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Upload size={12} /> Export
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors">
              <RefreshCw size={13} />
            </button>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-slate-500 whitespace-nowrap">
                Preview with sample data
              </span>
              <button
                onClick={() => setSampleData((v) => !v)}
                className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${sampleData ? "bg-violet-600" : "bg-slate-200"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${sampleData ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Info banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">👑</span>
              <p className="text-xs font-semibold text-slate-700">
                Your daily Meta messaging limit
              </p>
              <Info size={11} className="text-slate-400" />
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: "0.5%" }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                10/2000 unique contacts
              </span>
              <button className="text-[11px] text-violet-600 hover:underline font-medium">
                What are limits?
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-yellow-500" />
              <p className="text-xs font-semibold text-slate-700">
                Consecutive days of messaging
              </p>
              <Info size={11} className="text-slate-400" />
            </div>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full border-2 ${i < 1 ? "border-yellow-400 bg-yellow-50" : "border-slate-200"}`}
                />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-blue-500" />
              <p className="text-xs font-semibold text-slate-700">
                Messaging Quality
              </p>
              <Info size={11} className="text-slate-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart2 size={18} className="text-green-500" />
              <span className="text-sm font-bold text-green-600">High</span>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* All Campaigns table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-4 flex items-center justify-between gap-3 border-b border-slate-100 flex-wrap">
            <h3 className="text-sm font-bold text-slate-800">All Campaigns</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Sort by:</span>
                <button className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                  Latest <ChevronDown size={11} />
                </button>
              </div>
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  placeholder="Search..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 w-40 transition-colors"
                />
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                <Filter size={13} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {[
                    "Campaign name",
                    "Template",
                    "Total recipients",
                    "Successful",
                    "Read",
                    "Replied",
                    "Delivery status",
                    "Website clicks",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-600 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                          <Layers size={20} className="text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-400">
                          No campaigns yet.
                        </p>
                        <button
                          onClick={onNew}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          <Plus size={13} /> New Campaign
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-slate-800">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {c.date}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-[140px] truncate">
                        {c.template || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {c.recipients}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {c.successful}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {c.read}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {c.replied}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${STATUS_STYLE[c.status]}`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {c.clicks}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="w-7 h-7 flex items-center justify-center rounded-md text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => onDelete(c.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Create Campaign Page ─────────────────────────────────────────────────────
const CreateCampaign = ({
  onBack,
  onPublish,
}: {
  onBack: () => void;
  onPublish: (c: Campaign) => void;
}) => {
  const [campaignName, setCampaignName] = useState(
    `Untitled_${Date.now().toString().slice(-10)}`,
  );
  const [templateOpen, setTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [search, setSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set(),
  );
  const [sendOption, setSendOption] = useState<"now" | "schedule">("now");
  const [autoRetry, setAutoRetry] = useState(false);
  const [excludeExpand, setExcludeExpand] = useState(false);
  const [dismissBanner, setDismissBanner] = useState(false);
  const [rowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = TEMPLATES.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase()),
  );
  const pagedContacts = CONTACTS.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const totalPages = Math.ceil(CONTACTS.length / rowsPerPage);

  const toggleContact = (id: string) =>
    setSelectedContacts((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const handlePublish = () => {
    const now = new Date();
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: campaignName.trim() || `Untitled_${Date.now()}`,
      template: selectedTemplate,
      recipients: selectedContacts.size,
      successful: 0,
      read: 0,
      replied: 0,
      status: sendOption === "now" ? "Sent" : "Scheduled",
      clicks: 0,
      date: now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    onPublish(newCampaign);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-full bg-slate-50">
      {/* Left */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 sticky top-0 z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-violet-600 transition-colors"
          >
            <ArrowLeft size={16} /> Create New Campaign
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-1.5 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handlePublish}
              className="px-5 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Publish
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 flex flex-col gap-5">
          {/* Campaign name */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Campaign name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>

          {/* Select template */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-600">
                Select template message
              </label>
              <button className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors">
                + Add New Template
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setTemplateOpen((v) => !v)}
                className="w-full flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white hover:border-slate-300 transition-colors"
              >
                <span
                  className={
                    selectedTemplate ? "text-slate-700" : "text-slate-300"
                  }
                >
                  {selectedTemplate || "|"}
                </span>
                <ChevronUp
                  size={14}
                  className={`text-slate-400 transition-transform ${templateOpen ? "" : "rotate-180"}`}
                />
              </button>
              {templateOpen && (
                <div className="border border-t-0 border-slate-200 rounded-b-lg overflow-hidden bg-white shadow-lg z-10 relative">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search templates…"
                      className="w-full text-sm text-slate-700 placeholder-slate-300 focus:outline-none"
                    />
                  </div>
                  <div className="max-h-44 overflow-y-auto divide-y divide-slate-50">
                    {filtered.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setSelectedTemplate(t);
                          setTemplateOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedTemplate === t ? "text-violet-700 bg-violet-50 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audience */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {FILTER_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:border-violet-400 hover:text-violet-700 transition-colors"
                >
                  <span>{chip.emoji}</span> {chip.label} ({chip.count}){" "}
                  <Plus size={11} className="text-slate-400" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  placeholder="Search..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                <Filter size={14} />
              </button>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-green-600 border border-green-300 rounded-lg px-3 py-2 hover:bg-green-50 transition-colors w-fit">
              <Plus size={12} /> Add another filter
            </button>
            {!dismissBanner && (
              <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-lg px-4 py-3 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🎉</span>
                  <span className="text-xs font-medium text-slate-700">
                    We've identified 102 phone numbers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded-lg border border-violet-400 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition-colors">
                    View Contacts
                  </button>
                  <button
                    onClick={() => setDismissBanner(true)}
                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-green-600 font-medium">
                Selected: {selectedContacts.size} / 1990 Contacts remaining
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                Daily limit: 2000/Day{" "}
                <Info size={11} className="text-slate-400" />
              </p>
            </div>

            {/* Contacts table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="w-10 px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={
                          pagedContacts.length > 0 &&
                          pagedContacts.every((c) => selectedContacts.has(c.id))
                        }
                        onChange={() => {
                          const ids = pagedContacts.map((c) => c.id);
                          const allSel = ids.every((id) =>
                            selectedContacts.has(id),
                          );
                          setSelectedContacts((prev) => {
                            const n = new Set(prev);
                            allSel
                              ? ids.forEach((id) => n.delete(id))
                              : ids.forEach((id) => n.add(id));
                            return n;
                          });
                        }}
                        className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 cursor-pointer"
                      />
                    </th>
                    {["Name ↑", "Phone", "Allow Campaign"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pagedContacts.map((c) => (
                    <tr
                      key={c.id}
                      className={`transition-colors ${selectedContacts.has(c.id) ? "bg-violet-50" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={selectedContacts.has(c.id)}
                          onChange={() => toggleContact(c.id)}
                          className="rounded border-slate-300 text-violet-600 focus:ring-violet-400 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-700">
                        {c.name}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600 font-mono">
                        {c.phone}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                          TRUE <Check size={11} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-end gap-3 flex-wrap bg-white">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  Rows per page:
                  <button className="flex items-center gap-0.5 border border-slate-200 rounded px-1.5 py-0.5 hover:bg-slate-50">
                    5 <ChevronDown size={10} />
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  1–{Math.min(rowsPerPage, CONTACTS.length)} of{" "}
                  {CONTACTS.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-xs text-slate-500 hover:text-violet-600 disabled:opacity-40 flex items-center gap-0.5"
                  >
                    <ChevronLeft size={12} /> Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="text-xs text-green-600 hover:text-green-700 disabled:opacity-40 flex items-center gap-0.5"
                  >
                    Next <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Exclude invalid */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExcludeExpand((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
              >
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  Exclude invalid contacts{" "}
                  <Info size={11} className="text-slate-400" />
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${excludeExpand ? "rotate-180" : ""}`}
                />
              </button>
              {excludeExpand && (
                <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
                  <p className="text-xs text-slate-500">
                    Contacts with invalid phone numbers will be excluded from
                    this campaign.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* When to send */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              When do you want to send it?
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                { value: "now" as const, label: "Send now" },
                {
                  value: "schedule" as const,
                  label: "Schedule for a specific time",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  onClick={() => setSendOption(opt.value)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${sendOption === opt.value ? "border-green-500" : "border-slate-300 group-hover:border-slate-400"}`}
                  >
                    {sendOption === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                  </div>
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Auto-retry */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-800">
                    Auto-retry campaigns
                  </h3>
                  <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    New
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Boost your campaign reach with our auto-retry feature!
                </p>
              </div>
              <button
                onClick={() => setAutoRetry((v) => !v)}
                className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${autoRetry ? "bg-green-500" : "bg-slate-200"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${autoRetry ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                Retry messages until
              </span>
              <button className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Calendar size={12} className="text-slate-400" /> 23-March-2026{" "}
                <ChevronDown size={11} />
              </button>
            </div>
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Circle size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                We'd recommend skipping this for time-sensitive messages or
                campaigns that will expire before the end date. Credits will be
                deducted once message delivery is successful.
              </p>
            </div>
          </div>
          <div className="h-6" />
        </div>
      </div>

      {/* Right preview */}
      <div className="hidden lg:flex w-72 xl:w-80 shrink-0 border-l border-slate-200 bg-white flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="px-6 pt-6 pb-4">
          <PhonePreview />
        </div>
      </div>
    </div>
  );
};

// ─── Root Campaigns ───────────────────────────────────────────────────────────
const Campaigns = () => {
  const [view, setView] = useState<"overview" | "create">("overview");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const handlePublish = (c: Campaign) => {
    setCampaigns((prev) => [c, ...prev]);
    setView("overview");
  };

  const handleDelete = (id: string) =>
    setCampaigns((prev) => prev.filter((c) => c.id !== id));

  return view === "overview" ? (
    <OverviewPage
      campaigns={campaigns}
      onNew={() => setView("create")}
      onDelete={handleDelete}
    />
  ) : (
    <CreateCampaign
      onBack={() => setView("overview")}
      onPublish={handlePublish}
    />
  );
};

export default Campaigns;
