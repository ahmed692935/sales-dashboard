import api from "../lib/axios";

export interface Stage {
  id: string;
  orgId: string;
  name: string;
  slug: string;
  color: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStageDto {
  name: string;
  slug?: string;
  color?: string;
}

export interface UpdateStageDto {
  name?: string;
  slug?: string;
  color?: string;
}

export const stagesService = {
  async list(): Promise<Stage[]> {
    const { data } = await api.get("/leads/stages");
    return data.data;
  },

  async getById(id: string): Promise<Stage> {
    const { data } = await api.get(`/leads/stages/${id}`);
    return data.data;
  },

  async create(dto: CreateStageDto): Promise<Stage> {
    const { data } = await api.post("/leads/stages", dto);
    return data.data;
  },

  async update(id: string, dto: UpdateStageDto): Promise<Stage> {
    const { data } = await api.patch(`/leads/stages/${id}`, dto);
    return data.data;
  },

  async reorder(stageIds: string[]): Promise<Stage[]> {
    const { data } = await api.put("/leads/stages/reorder", { stageIds });
    return data.data;
  },

  async remove(id: string): Promise<Stage> {
    const { data } = await api.delete(`/leads/stages/${id}`);
    return data.data;
  },
};
