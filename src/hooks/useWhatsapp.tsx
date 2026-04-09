import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
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
