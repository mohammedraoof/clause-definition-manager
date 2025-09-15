import { Link } from "@tanstack/react-router";
import {
	BarChart3,
	Bell,
	Building,
	FileText,
	Grid,
	Laptop,
	LogOut,
	Settings,
	User,
	Users,
} from "lucide-react";
import Header from "./Header";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "./ui/sidebar";

interface LayoutProps {
	readonly children: React.ReactNode;
}

const navigationItems = [
	{ icon: Grid, label: "Overview" },
	{ icon: FileText, label: "Contracts" },
	{ icon: FileText, label: "Forms" },
	{ icon: Users, label: "Team Members" },
	{ icon: Laptop, label: "Consultation Sessions" },
	{ icon: Building, label: "Users" },
	{ icon: BarChart3, label: "Statistics" },
	{ icon: User, label: "Profile" },
	{ icon: Bell, label: "Notifications" },
	{ icon: Settings, label: "Settings" },
	{ icon: LogOut, label: "Logout" },
];

export default function Layout({ children }: LayoutProps) {
	return (
		<SidebarProvider>
			<Sidebar variant="inset">
				<SidebarHeader>
					<div className="flex items-center gap-2 px-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
							<span className="text-sm font-bold">CM</span>
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-semibold">Clause Manager</span>
							<span className="text-xs text-sidebar-foreground/70">
								Definition Manager
							</span>
						</div>
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{navigationItems.map((item) => {
									const IconComponent = item.icon;
									return (
										<SidebarMenuItem key={item.label}>
											<SidebarMenuButton asChild>
												<Link to="/">
													<IconComponent className="h-4 w-4" />
													<span>{item.label}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<div className="px-2 py-2 text-xs text-sidebar-foreground/70">
						Clause Definition Manager v1.0
					</div>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<Header />
				<main className="flex-1 p-4">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
