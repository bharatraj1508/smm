import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  LucideProps,
  Search,
  Settings,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/store/hooks/auth";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type Items = {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  pathname: string;
};

const items: Items[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    pathname: "dashboard",
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
    pathname: "inbox",
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
    pathname: "calendar",
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
    pathname: "search",
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    pathname: "settings",
  },
];

export function AppSidebar() {
  const router = useRouter();
  const logout = useLogout();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const handlelogout = () => {
    queryClient.clear();
    logout();
    router.push("/auth/login");
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isSelected = pathname.includes(
                  item.pathname.toLowerCase()
                );
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={classNames(
                      isSelected &&
                        "rounded-md border border-sidebar-primary bg-white"
                    )}
                  >
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* we will comeback to this to show user full name here rather a static text */}
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span onClick={() => handlelogout()}>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
