"use client";

import OneLink from "./oneLink";
import styles from "@/utils/sass/navLinks.module.scss";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import React from "react";
import Swal from "sweetalert2";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname } from "next/navigation";

const NavLinks = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session, status]);

  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are going to logout",
      icon: "warning",
      // background: "#ccc url(/images/trees.png)",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await signOut({ callbackUrl: "/signin" });
      }
    });
  };

  const pages = [{ title: "Home", route: "/" }];
  const path = usePathname();
  const renderLinks = () => (
    <>
      {path === "/signin" || path == "/signup" ? (
        <div></div>
      ) : (
        <div>
          {pages.map((link) => (
            <OneLink key={link.route} oneLink={link} />
          ))}
        </div>
      )}
      {isLoggedIn ? (
        <>
          <div>
            <OneLink
              key="profile"
              oneLink={{ title: "Profile", route: "/profile" }}
            />
          </div>
          <div>
            <OneLink
              key="rules"
              oneLink={{ title: "Game Rules", route: "/rules" }}
            />
          </div>
          <div>
            <OneLink
              key="highestScore"
              oneLink={{ title: "Highest Score", route: "/highestScore" }}
            />
          </div>

          <div onClick={handleLogout} role="button" tabIndex={0}>
            <OneLink key="logout" oneLink={{ title: "Logout", route: "" }} />
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );

  return (
    <div className={styles.nav}>
      <div className={styles.navbarContainer}>{renderLinks()}</div>

      {/* Toggle button for small screens */}
      <button
        className={styles.menuButton}
        onClick={() => setOpen((prev) => !prev)}
        aria-pressed={open}
      >
        {!open ? (
          <FontAwesomeIcon icon={faBars} size="2x" className={styles.icon} />
        ) : (
          <FontAwesomeIcon icon={faXmark} size="2x" className={styles.icon} />
        )}
      </button>

      {/* Mobile navbar */}
      {open && (
        <div className={`${styles.smallScreen} ${open ? styles.open : ""}`}>
          {renderLinks()}
        </div>
      )}
    </div>
  );
};

export default NavLinks;
