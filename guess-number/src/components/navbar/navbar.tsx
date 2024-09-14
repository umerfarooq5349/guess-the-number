"use client";

import { usePathname } from "next/navigation";
import NavLinks from "./navLinks";

const Navbar = () => {
  const path = usePathname();

  return path === "/login" || path === "/signup" ? (
    <div> </div>
  ) : (
    <NavLinks></NavLinks>
  );
};

export default Navbar;
