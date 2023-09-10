import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center">
      <h2>Troptix</h2>

      <Button>Log In</Button>
    </nav>
  );
}
