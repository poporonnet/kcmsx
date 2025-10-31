import { Badge } from "@mantine/core";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";

export const NetworkStatusBadge = ({ online }: { online: boolean }) => (
  <Badge
    size="lg"
    color={online ? "green" : "red"}
    leftSection={online ? <IconWifi size={18} /> : <IconWifiOff size={18} />}
  >
    {online ? "オンライン" : "オフライン"}
  </Badge>
);
