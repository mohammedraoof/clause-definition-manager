import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger className="-ml-1" />
			<div className="flex-1" />
			<div className="flex items-center gap-2">
				<span className="text-sm text-muted-foreground">
					Clause Definition Manager
				</span>
			</div>
		</header>
	);
}
