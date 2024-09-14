import styles from "@/utils/sass/oneLink.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface oneLinkType {
  title: string;
  route: string;
}

const OneLink = ({ oneLink }: { oneLink: oneLinkType }) => {
  const path = usePathname();

  return (
    <div
      className={`${styles.navLink} ${
        path === oneLink.route && styles.activate
      }`}
    >
      <Link href={oneLink.route}>{oneLink.title}</Link>
    </div>
  );
};

export default OneLink;
