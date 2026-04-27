import { FileText, MapPin } from "lucide-react";
import { useMediaUrl } from "../../../hooks/useWhatsapp";
import type { Message } from "../../../services/whatsapp.service";

const MediaDisplay = ({ msg }: { msg: Message }) => {
  const { data: url, isLoading } = useMediaUrl(msg.mediaId);

  if (isLoading || !url) {
    return (
      <div className="text-xs opacity-60 animate-pulse py-1">
        Loading media...
      </div>
    );
  }

  if (msg.type === "image" || msg.type === "sticker") {
    return (
      <div className="flex flex-col gap-1">
        <img
          src={url}
          alt={msg.caption ?? "Image"}
          className="rounded-lg max-w-full max-h-60 object-cover"
        />
        {msg.caption && <p className="text-md ">{msg.caption}</p>}
      </div>
    );
  }

  if (msg.type === "video") {
    return (
      <div className="flex flex-col gap-1">
        <video controls src={url} className="rounded-lg max-w-full max-h-60" />
        {msg.caption && <p className="text-md">{msg.caption}</p>}
      </div>
    );
  }

  if (msg.type === "audio") {
    return <audio controls src={url} className="max-w-full" />;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 underline underline-offset-2"
    >
      <FileText size={15} />
      <span>{msg.filename ?? "Download file"}</span>
    </a>
  );
};

const BubbleContent = ({ msg }: { msg: Message }) => {
  switch (msg.type) {
    case "image":
    case "video":
    case "audio":
    case "sticker":
    case "document":
      return <MediaDisplay msg={msg} />;

    case "location":
      return (
        <a
          href={`https://www.google.com/maps?q=${msg.latitude},${msg.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 underline underline-offset-2"
        >
          <MapPin size={14} />
          {msg.locationName ?? `${msg.latitude}, ${msg.longitude}`}
          {msg.locationAddress && (
            <span className="opacity-70 text-xs">{msg.locationAddress}</span>
          )}
        </a>
      );

    case "reaction":
      return <span className="text-2xl leading-none">{msg.reactionEmoji}</span>;

    case "interactive":
      return (
        <div className="flex flex-col gap-0.5">
          {msg.interactiveType && (
            <span className="text-[10px] opacity-60 capitalize">
              {msg.interactiveType.replace("_", " ")}
            </span>
          )}
          <span>{msg.interactiveTitle ?? msg.body}</span>
        </div>
      );

    default:
      return <span className="whitespace-pre-line">{msg.body}</span>;
  }
};

interface MessageBubbleProps {
  msg: Message;
}

export const MessageBubble = ({ msg }: MessageBubbleProps) => {
  const isAgent = msg.direction === "outbound";

  return (
    <div className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isAgent
            ? "bg-violet-600 text-white rounded-br-sm"
            : "bg-white text-slate-700 rounded-bl-sm"
        }`}
      >
        <BubbleContent msg={msg} />
      </div>
      <span className="text-[10px] text-slate-400 mt-1 px-1">
        {new Date(msg.sentAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};
