import api from "../lib/axios";

export interface WhatsappAccount {
  id: string;
  orgId: string;
  wabaId: string;
  phoneNumberId: string;
  phoneNumber: string | null;
  connectedAt: string;
}

export interface WhatsappContact {
  id: string;
  orgId: string;
  phone: string;
  name: string | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  orgId: string;
  contactId: string;
  assignedTo: string | null;
  status: "open" | "closed";
  lastMessageAt: string;
  createdAt: string;
}

export interface ConversationWithContact {
  conversation: Conversation;
  contact: WhatsappContact | null;
}

export interface Message {
  id: string;
  orgId: string;
  conversationId: string;
  waMessageId: string | null;
  direction: "inbound" | "outbound";
  type: string;
  body: string;
  mediaId: string | null;
  mediaUrl: string | null;
  mimeType: string | null;
  filename: string | null;
  caption: string | null;
  latitude: number | null;
  longitude: number | null;
  locationName: string | null;
  locationAddress: string | null;
  reactionEmoji: string | null;
  reactionTargetId: string | null;
  interactiveType: string | null;
  interactiveId: string | null;
  interactiveTitle: string | null;
  status: "sent" | "delivered" | "read" | "failed";
  sentAt: string;
}

export interface WhatsappStatusResponse {
  connected: boolean;
  account: WhatsappAccount | null;
}

export interface ContactsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedContactsResponse {
  data: WhatsappContact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const whatsappService = {
  getStatus: async (): Promise<WhatsappStatusResponse> => {
    const { data } = await api.get("/whatsapp/status");
    return data.data;
  },

  connect: async (payload: {
    code: string;
    wabaId: string;
    phoneNumberId: string;
  }): Promise<WhatsappAccount> => {
    const { data } = await api.post("/whatsapp/connect", payload);
    return data.data;
  },

  disconnect: async (): Promise<void> => {
    await api.delete("/whatsapp/disconnect");
  },

  getConversations: async (): Promise<ConversationWithContact[]> => {
    const { data } = await api.get("/whatsapp/conversations");
    return data.data;
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const { data } = await api.get(
      `/whatsapp/conversations/${conversationId}/messages`,
    );
    return data.data;
  },

  sendMessage: async (
    conversationId: string,
    body: string,
  ): Promise<Message> => {
    const { data } = await api.post(
      `/whatsapp/conversations/${conversationId}/send`,
      { body },
    );
    return data.data;
  },

  uploadMedia: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post("/whatsapp/media/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.mediaId;
  },

  sendMediaMessage: async (
    conversationId: string,
    type: string,
    mediaId: string,
    caption?: string,
    filename?: string,
  ): Promise<Message> => {
    const { data } = await api.post(
      `/whatsapp/conversations/${conversationId}/send-media`,
      { type, mediaId, caption, filename },
    );
    return data.data;
  },

  getMediaUrl: async (mediaId: string): Promise<string> => {
    const { data } = await api.get(`/whatsapp/media/${mediaId}/url`);
    return data.data.url;
  },

  getContacts: async (
    params: ContactsParams = {},
  ): Promise<PaginatedContactsResponse> => {
    const { data } = await api.get("/whatsapp/contacts", { params });
    return { data: data.data, pagination: data.pagination };
  },

  initiateConversation: async (
    phone: string,
    body: string,
    templateName?: string,
    name?: string,
  ) => {
    const { data } = await api.post("/whatsapp/conversations/initiate", {
      phone,
      body,
      templateName,
      name,
    });
    return data.data;
  },
};

export default whatsappService;
