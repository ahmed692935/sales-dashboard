import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import usersService from "../services/user.service";
import type { CreateUserPayload, UpdateRolePayload, UsersParams } from "../services/user.service";

const USERS_KEY = "users";

export const useUsers = (params: UsersParams = {}) =>
  useQuery({
    queryKey: [USERS_KEY, params],
    queryFn: () => usersService.getAll(params),
    placeholderData: (prev) => prev, // keeps old data while fetching new page
  });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [USERS_KEY] });
      toast.success("User created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to create user");
    },
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      usersService.updateRole(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [USERS_KEY] });
      toast.success("Role updated");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to update role");
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [USERS_KEY] });
      toast.success("User removed");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? "Failed to remove user");
    },
  });
};