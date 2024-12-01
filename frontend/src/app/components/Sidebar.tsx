import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  AvatarIcon,
  QuestionMarkCircledIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import { Home, Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-4 text-xl font-semibold">
        <div className="flex items-center gap-2">
          <Image
            src="https://cdn.icon-icons.com/icons2/3907/PNG/512/face_recognition_icon_246687.png"
            alt="Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-semibold">QuickMark</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="/dashboard"
                  className="hover:bg-blue/80 hover:text-white"
                >
                  {" "}
                  <Home /> Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/students">
                  {" "}
                  <QuestionMarkCircledIcon /> Students
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/attendance">
                  {" "}
                  <AvatarIcon /> Attendance
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
