import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Plus,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  useWhatsappStatus,
  useConversations,
  useConnectWhatsapp,
} from "../hooks/useWhatsapp";
import { NewConversationModal } from "../components/Inbox/NewConversationsModal/NewConversationsModal";
import { ChatView } from "../components/Inbox/ChatView/ChatView";
import { useSearchParams } from "react-router-dom";
import { DetailPanel } from "../components/Inbox/DetailPanel/DetailPanel";

type ActivePanel = "list" | "chat" | "detail";

const ConnectWhatsapp = () => {
  const { mutate: connect, isPending } = useConnectWhatsapp();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const check = setInterval(() => {
      if ((window as any).FB) {
        setSdkReady(true);
        clearInterval(check);
      }
    }, 200);
    return () => clearInterval(check);
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (
        !["https://www.facebook.com", "https://web.facebook.com"].includes(
          e.origin,
        )
      )
        return;
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "WA_EMBEDDED_SIGNUP") {
          if (msg.event === "FINISH" && msg.data) {
            (window as any).__waData = {
              wabaId: msg.data.waba_id,
              phoneNumberId: msg.data.phone_number_id,
            };
          } else if (msg.event === "CANCEL") {
            setStatusMsg("Connection was cancelled.");
          } else if (msg.event === "ERROR") {
            setStatusMsg(
              `Error: ${msg.data?.error_message ?? "Please try again."}`,
            );
          }
        }
      } catch {
        /* ignore non-JSON */
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleConnect = () => {
    setStatusMsg(null);
    const FB = (window as any).FB;
    if (!FB) {
      setStatusMsg("Facebook SDK not loaded. Please refresh.");
      return;
    }
    FB.login(
      (response: any) => {
        if (response.authResponse?.code) {
          const code = response.authResponse.code;
          const waData = (window as any).__waData;
          if (!waData?.wabaId || !waData?.phoneNumberId) {
            setStatusMsg(
              "Could not get WhatsApp account details. Please try again.",
            );
            return;
          }
          connect(
            {
              code,
              wabaId: waData.wabaId,
              phoneNumberId: waData.phoneNumberId,
            },
            {
              onSuccess: () => {
                delete (window as any).__waData;
              },
              onError: () =>
                setStatusMsg("Failed to connect. Please try again."),
            },
          );
        } else {
          setStatusMsg("Login was cancelled or failed.");
        }
      },
      {
        config_id: import.meta.env.VITE_META_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: { sessionInfoVersion: 3 },
      },
    );
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 p-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center text-center max-w-sm w-full gap-5">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-9 h-9 fill-green-500">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M11.993 2C6.476 2 2 6.477 2 12.001c0 1.762.457 3.413 1.257 4.845L2 22l5.293-1.217A9.97 9.97 0 0011.993 22C17.516 22 22 17.522 22 12s-4.484-10-10.007-10zm0 18.214a8.188 8.188 0 01-4.181-1.14l-.299-.178-3.1.712.756-2.99-.195-.307A8.175 8.175 0 013.818 12c0-4.517 3.677-8.193 8.175-8.193S20.168 7.483 20.168 12c0 4.52-3.677 8.214-8.175 8.214z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Connect WhatsApp
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Connect your WhatsApp Business account to start sending and
            receiving messages.
          </p>
        </div>
        {statusMsg && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg w-full">
            {statusMsg}
          </p>
        )}
        {!sdkReady && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Loader2 size={12} className="animate-spin" /> Loading SDK...
          </p>
        )}
        <button
          onClick={handleConnect}
          disabled={isPending || !sdkReady}
          className="btn-primary w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Connecting...
            </>
          ) : (
            "Connect WhatsApp"
          )}
        </button>
        <p className="text-xs text-slate-400">
          A popup will open to authorize the connection with Meta.
        </p>
      </div>
    </div>
  );
};

const ContactList = ({
  activeId,
  onSelect,
  onClose,
  isConnected,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  onClose?: () => void;
  isConnected: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<"Newest" | "Lead" | "Application">(
    "Newest",
  );
  const tabs = ["Newest", "Lead", "Application Submitt..."] as const;
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  const { data: conversations = [], isLoading } = useConversations(isConnected);

  const filtered = conversations.filter((c) => {
    const name = c.contact?.name ?? c.contact?.phone ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <aside className="flex flex-col bg-white h-full border-r border-slate-200 w-full md:w-60 lg:w-68 xl:70 shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={15} />
          <span className="text-sm font-medium">Close</span>
        </button>
        <button
          onClick={() => setShowNew(true)}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="px-3 py-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <Search size={13} className="text-slate-600 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chat"
            className="flex-1 bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none min-w-0"
          />
        </div>
      </div>

      <div className="flex items-center px-2 py-1.5 border-b border-slate-100 gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(
                tab === "Application Submitt..." ? "Application" : (tab as any),
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

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
            <Loader2 size={15} className="animate-spin" />
            <span className="text-xs">Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <MessageSquare size={22} className="text-slate-300" />
            <p className="text-xs text-slate-400">No conversations yet</p>
          </div>
        ) : (
          filtered.map((c) => {
            const name = c.contact?.name ?? c.contact?.phone ?? "Unknown";
            const phone = c.contact?.phone ?? "";
            const initial = name.charAt(0).toUpperCase();
            return (
              <button
                key={c.conversation.id}
                onClick={() => onSelect(c.conversation.id)}
                className={`w-full flex items-start gap-2.5 px-3 py-2.5 border-b border-slate-50 text-left transition-colors ${
                  activeId === c.conversation.id
                    ? "bg-slate-50"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[12px] font-semibold text-slate-800 truncate">
                      {name}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(
                        c.conversation.lastMessageAt,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {phone}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        c.conversation.status === "open"
                          ? "bg-teal-500 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {c.conversation.status}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {showNew && (
        <NewConversationModal
          onClose={() => setShowNew(false)}
          onSuccess={(id) => {
            onSelect(id);
            setShowNew(false);
          }}
        />
      )}
    </aside>
  );
};

const TeamInbox = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationId = searchParams.get("chat_id");
  const [activePanel, setActivePanel] = useState<ActivePanel>(
    conversationId ? "chat" : "list",
  );

  const { data: statusData, isLoading: statusLoading } = useWhatsappStatus();
  const { data: conversations = [] } = useConversations(
    !!statusData?.connected,
  );

  const isConnected = statusData?.connected ?? false;
  const activeConversation =
    conversations.find((c) => c.conversation.id === conversationId) ?? null;

  const handleSelectContact = (id: string) => {
    setSearchParams({ chat_id: id });
    setActivePanel("chat");
  };

  const handleBack = () => {
    setSearchParams({});
    setActivePanel("list");
  };

  if (statusLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isConnected) return <ConnectWhatsapp />;

  return (
    <div className="flex flex-1 overflow-hidden w-full h-full">
      <div className="flex flex-1 lg:hidden overflow-hidden">
        {activePanel === "list" && (
          <ContactList
            activeId={conversationId ?? ""}
            onSelect={handleSelectContact}
            onClose={() => {}}
            isConnected={isConnected}
          />
        )}
        {activePanel === "chat" && (
          <ChatView
            conversationId={conversationId}
            contact={activeConversation}
            onBack={handleBack}
            onShowDetail={() => setActivePanel("detail")}
          />
        )}
        {activePanel === "detail" && activeConversation && (
          <DetailPanel
            contact={activeConversation}
            onBack={() => setActivePanel("chat")}
          />
        )}
      </div>

      <div className="hidden lg:flex flex-1 overflow-hidden">
        <ContactList
          activeId={conversationId ?? ""}
          onSelect={handleSelectContact}
          onClose={() => {}}
          isConnected={isConnected}
        />
        <ChatView
          conversationId={conversationId}
          contact={activeConversation}
        />
        {activeConversation && <DetailPanel contact={activeConversation} />}
      </div>
    </div>
  );
};

export default TeamInbox;
