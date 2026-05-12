import api from "../lib/axios";

export interface ContactTag {
  id: string;
  label: string;
  color: string;
  createdAt: string;
}

export interface ContactCustomField {
  id: string;
  key: string;
  value: string;
  createdAt: string;
}

export interface ContactNote {
  id: string;
  content: string;
  createdBy: string | null;
  authorName: string | null;
  createdAt: string;
}

export interface JourneyEvent {
  id: string;
  type: string;
  body: string;
  sentAt: string;
}

export interface DetailPanelData {
  contact: {
    id: string;
    phone: string;
    name: string | null;
    createdAt: string;
  };
  tags: ContactTag[];
  customFields: ContactCustomField[];
  notes: ContactNote[];
  journey: JourneyEvent[];
}

export const detailPanelService = {
  async getFullDetail(
    contactId: string,
    conversationId: string,
  ): Promise<DetailPanelData> {
    const { data } = await api.get(
      `/contacts/${contactId}/detail?conversationId=${conversationId}`,
    );
    return data.data;
  },

  async updateContact(
    contactId: string,
    dto: { name?: string; phone?: string },
  ) {
    const { data } = await api.patch(`/contacts/${contactId}`, dto);
    return data.data;
  },

  async addTag(
    contactId: string,
    dto: { label: string; color?: string },
  ): Promise<ContactTag> {
    const { data } = await api.post(`/contacts/${contactId}/tags`, dto);
    return data.data;
  },

  async removeTag(tagId: string): Promise<ContactTag> {
    const { data } = await api.delete(`/contacts/tags/${tagId}`);
    return data.data;
  },

  async upsertCustomField(
    contactId: string,
    dto: { key: string; value: string },
  ): Promise<ContactCustomField> {
    const { data } = await api.put(`/contacts/${contactId}/custom-fields`, dto);
    return data.data;
  },

  async removeCustomField(fieldId: string): Promise<ContactCustomField> {
    const { data } = await api.delete(`/contacts/custom-fields/${fieldId}`);
    return data.data;
  },

  async addNote(contactId: string, content: string): Promise<ContactNote> {
    const { data } = await api.post(`/contacts/${contactId}/notes`, {
      content,
    });
    return data.data;
  },

  async removeNote(noteId: string): Promise<ContactNote> {
    const { data } = await api.delete(`/contacts/notes/${noteId}`);
    return data.data;
  },
};
