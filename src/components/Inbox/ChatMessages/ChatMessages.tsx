import { useMemo } from "react";
import type { Message } from "../../../services/whatsapp.service";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import {
  DateSeparator,
  SystemMessageBubble,
  isSystemMessage,
  formatDateLabel,
} from "./SystemMessage";

type ChatItem =
  | { kind: "date"; label: string; key: string }
  | { kind: "system"; msg: Message; key: string }
  | { kind: "message"; msg: Message; key: string };

function buildChatItems(messages: Message[]): ChatItem[] {
  const items: ChatItem[] = [];
  let lastDateLabel = "";

  for (const msg of messages) {
    const sentAt = new Date(msg.sentAt);
    const dateLabel = formatDateLabel(sentAt);

    if (dateLabel !== lastDateLabel) {
      items.push({ kind: "date", label: dateLabel, key: `date-${msg.id}` });
      lastDateLabel = dateLabel;
    }

    if (isSystemMessage(msg)) {
      items.push({ kind: "system", msg, key: msg.id });
    } else {
      items.push({ kind: "message", msg, key: msg.id });
    }
  }

  return items;
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const items = useMemo(() => buildChatItems(messages), [messages]);

  return (
    <>
      {items.map((item) => {
        switch (item.kind) {
          case "date":
            return <DateSeparator key={item.key} date={item.label} />;
          case "system":
            return <SystemMessageBubble key={item.key} msg={item.msg} />;
          case "message":
            return <MessageBubble key={item.key} msg={item.msg} />;
        }
      })}
    </>
  );
};
