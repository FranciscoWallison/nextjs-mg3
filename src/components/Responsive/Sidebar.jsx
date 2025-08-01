// src/components/Responsive/Sidebar.jsx
"use client";

import { useTheme, useMediaQuery } from "@mui/material";
import DesktopSidebar from "../SidebarDesktop";
import MobileSidebar  from "../SidebarMobile";

export default function SidebarFacade(props) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  return isMdUp
    ? <DesktopSidebar {...props} />
    : <MobileSidebar  {...props} />;
}
