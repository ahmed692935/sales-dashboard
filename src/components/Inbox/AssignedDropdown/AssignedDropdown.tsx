import { useState } from "react";
import { useUsers } from "../../../hooks/useUsers";
import {
  PaginatedDropdown,
  type DropdownOption,
} from "../../global/PaginatedDropdown/PaginatedDropdown";

interface AssigneeDropdownProps {
  assignedUser: { id: string; name: string } | null;
  onSelect: (user: { id: string; name: string } | null) => void;
}

export const AssigneeDropdown = ({
  assignedUser,
  onSelect,
}: AssigneeDropdownProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUsers({
    page,
    limit: 8,
    search: search || undefined,
  });

  const options: DropdownOption[] =
    data?.data.map((u) => ({
      id: u.id,
      label: u.name,
      sublabel: u.email,
      avatar: u.name,
    })) ?? [];

  const value: DropdownOption | null = assignedUser
    ? {
        id: assignedUser.id,
        label: assignedUser.name,
        avatar: assignedUser.name,
      }
    : null;

  return (
    <PaginatedDropdown
      value={value}
      placeholder="Assign to"
      options={options}
      pagination={data?.pagination ?? null}
      isLoading={isLoading}
      onSearch={(s, p) => {
        setSearch(s);
        setPage(p);
      }}
      onSelect={(option) =>
        onSelect(option ? { id: option.id, name: option.label } : null)
      }
      align="right"
      width="w-60"
    />
  );
};
