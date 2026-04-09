import api from "../lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "organizer" | "manager" | "member" | "viewer";
  orgId: string;
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: "manager" | "member" | "viewer";
}

export interface UpdateRolePayload {
  role: "manager" | "member" | "viewer";
}

export interface UsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const usersService = {
  getAll: async (params: UsersParams = {}): Promise<PaginatedUsersResponse> => {
    const { data } = await api.get("/users", { params });
    return { data: data.data, pagination: data.pagination };
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return data.data;
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await api.post("/users", payload);
    return data.data;
  },

  updateRole: async (id: string, payload: UpdateRolePayload): Promise<User> => {
    const { data } = await api.patch(`/users/${id}/role`, payload);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default usersService;
