import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../lib/axios";
import whatsappService, {
  type ContactsParams,
} from "../services/whatsapp.service";

export const useWhatsappStatus = () =>
  useQuery({
    queryKey: ["whatsapp-status"],
    queryFn: whatsappService.getStatus,
  });

export const useConversations = (enabled: boolean) =>
  useQuery({
    queryKey: ["whatsapp-conversations"],
    queryFn: whatsappService.getConversations,
    enabled,
    refetchInterval: 10000,
  });

export const useMessages = (conversationId: string | null) =>
  useQuery({
    queryKey: ["whatsapp-messages", conversationId],
    queryFn: () => whatsappService.getMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 5000,
  });

export const useMediaUrl = (mediaId: string | null) =>
  useQuery({
    queryKey: ["whatsapp-media-blob", mediaId],
    queryFn: async () => {
      const response = await api.get(`/whatsapp/media/${mediaId}/proxy`, {
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    },
    enabled: !!mediaId,
    staleTime: 4 * 60 * 1000,
  });

export const useSendMessage = (conversationId: string | null) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) =>
      whatsappService.sendMessage(conversationId!, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-messages", conversationId] });
      qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to send message");
    },
  });
};

export const useUploadAndSendMedia = (conversationId: string | null) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, caption }: { file: File; caption?: string }) => {
      const mediaId = await whatsappService.uploadMedia(file);
      const type = resolveMediaType(file.type);
      return whatsappService.sendMediaMessage(
        conversationId!,
        type,
        mediaId,
        caption,
        type === "document" ? file.name : undefined,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-messages", conversationId] });
      qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to send file");
    },
  });
};

export const useConnectWhatsapp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: whatsappService.connect,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-status"] });
      toast.success("WhatsApp connected successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to connect WhatsApp");
    },
  });
};

export const useDisconnectWhatsapp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: whatsappService.disconnect,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-status"] });
      toast.success("WhatsApp disconnected");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to disconnect");
    },
  });
};

export const useContacts = (params: ContactsParams = {}) =>
  useQuery({
    queryKey: ["whatsapp-contacts", params],
    queryFn: () => whatsappService.getContacts(params),
    placeholderData: (prev) => prev,
  });

export const useInitiateConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      phone,
      body,
      name,
      templateName,
    }: {
      phone: string;
      body: string;
      name?: string;
      templateName?: string;
    }) => whatsappService.initiateConversation(phone, body, name, templateName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
      toast.success("Message sent!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to send message");
    },
  });
};

export const useAssignConversation = (conversationId: string | null) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string | null) =>
      whatsappService.assignConversation(conversationId!, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
      toast.success("Conversation assigned");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to assign");
    },
  });
};

export const useUnassignConversation = (conversationId: string | null) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => whatsappService.unassignConversation(conversationId!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
      toast.success("Conversation unassigned");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to unassign");
    },
  });
};

export const useUpdateStage = (conversationId: string | null) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (stage: string | null) =>
      whatsappService.updateStage(conversationId!, stage),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
      qc.invalidateQueries({ queryKey: ["kanban-conversations"] });
      toast.success("Stage updated");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to update stage");
    },
  });
};

function resolveMediaType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "document";
}
