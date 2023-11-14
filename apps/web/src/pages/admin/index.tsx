import { TicketDetail } from "@/components/TicketDetail";
import { useFetchEvent } from "@/hooks/useFetchEvent";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from 'next/link';

import Head from 'next/head'
import Sidebar from "@/components/admin/Sidebar";
import { useState } from "react";
import DashboardPage from "./dashboard";
import ManageEventsPage from "./manage-events";
export default function AdminPage({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  const router = useRouter();

  return (
    <div>
      <ManageEventsPage />
    </div>
  );
}