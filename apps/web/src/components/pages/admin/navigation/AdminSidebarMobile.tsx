
import {
  AreaChart,
  Plus,
  ShoppingCart,
  SquareGanttChart,
  Users
} from "lucide-react";
import Link from "next/link";

import { usePathname } from "next/navigation";

interface Item {
  path: string;
  title: string;
  isCurrent: boolean;
  icon: any;
}

export default function AdminSidebarMobile() {
  const pathname = usePathname();

  function renderItem(item: Item) {
    return (
      <Link
        href={item.path}
        className={`${item.isCurrent ? 'bg-stone-200' : ''} mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground`}
      >
        {item.icon}
        {item.title}
      </Link>
    )
  }

  return (
    <nav className="grid gap-2 text-lg font-medium">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        <span>TropTix</span>
      </Link>

      {renderItem({
        path: "/admin/manage-events",
        title: "Manage Events",
        isCurrent: pathname.includes('/manage-event') || pathname === "/admin",
        icon: <SquareGanttChart className="h-5 w-5" />
      })}

      {renderItem({
        path: "/admin/add-event",
        title: "Add Event",
        isCurrent: pathname.includes('add-event'),
        icon: <Plus className="h-5 w-5" />
      })}

      {renderItem({
        path: "/admin/orders",
        title: "Orders",
        isCurrent: pathname.includes('orders'),
        icon: <ShoppingCart className="h-5 w-5" />
      })}

      {renderItem({
        path: "/admin/finances",
        title: "Finances",
        isCurrent: pathname.includes('finances'),
        icon: <AreaChart className="h-5 w-5" />
      })}

      {renderItem({
        path: "/admin/organization-settings",
        title: "Organization Settings",
        isCurrent: pathname.includes('organization-settings'),
        icon: <Users className="h-5 w-5" />
      })}
    </nav>
  )
}