import { ActionIcon, useMantineTheme } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { useCallback, useState } from "react";

export type Order = "asc" | "desc";

export const Sort = ({
  active,
  defaultOrder,
  onSort,
  ...props
}: {
  active: boolean;
  defaultOrder?: Order;
  onSort: (order: Order) => void;
} & Parameters<typeof IconSortAscending>[0]) => {
  const theme = useMantineTheme();
  const [order, setOrder] = useState<Order>(defaultOrder ?? "asc");
  const onClick = useCallback(() => {
    const nextOrder: Order = order == "asc" ? "desc" : "asc";
    onSort(nextOrder);
    setOrder(nextOrder);
  }, [onSort, order]);
  const color = active ? theme.colors.blue[6] : theme.colors.gray[6];

  return (
    <ActionIcon onClick={onClick} variant="subtle" color={color}>
      {order == "asc" && <IconSortAscending {...props} />}
      {order == "desc" && <IconSortDescending {...props} />}
    </ActionIcon>
  );
};
