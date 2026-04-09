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
  body: string;
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

  getContacts: async (
    params: ContactsParams = {},
  ): Promise<PaginatedContactsResponse> => {
    const { data } = await api.get("/whatsapp/contacts", { params });
    return { data: data.data, pagination: data.pagination };
  },
};

export default whatsappService;
