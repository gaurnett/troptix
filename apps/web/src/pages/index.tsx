import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="">
      <div>
        <h1 className="text-3xl font-bold my-14">
          Troptix is a better way to{" "}
          <span className="text-red-100">get tickets</span>
        </h1>
        <Button>Explore Events</Button>
      </div>
      <section></section>
    </main>
  );
}
