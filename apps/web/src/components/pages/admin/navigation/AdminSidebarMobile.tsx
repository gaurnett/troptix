
import {
  Home,
  Package,
  Package2,
  ShoppingCart,
  Users
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"

export default function AdminSidebarMobile() {
  return (
    <nav className="grid gap-2 text-lg font-medium">
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <Link
        href="#"
        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
      >
        <Home className="h-5 w-5" />
        Manage Events
      </Link>
      <Link
        href="#"
        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
      >
        <Home className="h-5 w-5" />
        Add Event
      </Link>
      <Link
        href="#"
        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
      >
        <ShoppingCart className="h-5 w-5" />
        Orders
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          6
        </Badge>
      </Link>
      <Link
        href="#"
        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
      >
        <Package className="h-5 w-5" />
        Finances
      </Link>
      <Link
        href="#"
        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
      >
        <Users className="h-5 w-5" />
        Organization Settings
      </Link>
    </nav>
  )
}