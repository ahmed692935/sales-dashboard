import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  detailPanelService,
  type DetailPanelData,
} from "../services/detail-panel.service";

function key(contactId: string | null) {
  return ["contact-detail", contactId];
}

export function useContactDetail(
  contactId: string | null,
  conversationId: string | null,
) {
  return useQuery<DetailPanelData>({
    queryKey: key(contactId),
    queryFn: () =>
      detailPanelService.getFullDetail(contactId!, conversationId!),
    enabled: !!contactId && !!conversationId,
  });
}

export function useUpdateContact(contactId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name?: string; phone?: string }) =>
      detailPanelService.updateContact(contactId!, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key(contactId) });
      qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
    },
  });
}

export function useAddTag(contactId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { label: string; color?: string }) =>
      detailPanelService.addTag(contactId!, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(contactId) }),
  });
}

export function useRemoveTag(contactId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tagId: string) => detailPanelService.removeTag(tagId),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(contactId) }),
  });
}

export function useUpsertCustomField(contactId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { key: string; value: string }) =>
      detailPanelService.upsertCustomField(contactId!, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(contactId) }),
  });
}

export function useRemoveCustomField(contactId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fieldId: string) =>
      detailPanelService.removeCustomField(fieldId),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(contactId) }),
  });
}

export function useAddNote(contactId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      detailPanelService.addNote(contactId!, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(contactId) }),
  });
}

export function useRemoveNote(contactId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => detailPanelService.removeNote(noteId),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(contactId) }),
  });
}
