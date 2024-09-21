import { NextPage } from "next";
import styles from "@/utils/sass/footer.module.scss"; // Assuming this is the correct path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

interface Props {}

const Footer: NextPage<Props> = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.about}>
        <Link
          className={`${styles.bg_links} ${styles.social} ${styles.email}`}
          href="mailto:mumerfarooq557@gmail.com"
        >
          <FontAwesomeIcon
            icon={faEnvelope}
            // size="1x"
            className={styles.icon}
          />
        </Link>
        <Link
          className={`${styles.bg_links} ${styles.social} ${styles.instagram}`}
          href="https://www.instagram.com/umer_faro_oq"
          target="_blank"
        >
          <FontAwesomeIcon
            icon={faInstagram}
            // size="1x"
            className={styles.icon}
          />
        </Link>
        <Link
          className={`${styles.bg_links} ${styles.social} ${styles.linkedin}`}
          href="https://www.linkedin.com/in/umer-farooq-0340a4223"
          target="_blank"
        >
          <FontAwesomeIcon
            icon={faLinkedinIn}
            // size="1x"
            className={styles.icon}
          />
          {/* <span className={styles.icon}></span> */}
        </Link>
        <FontAwesomeIcon
          icon={faAddressCard}
          size="3x"
          // href="https://www.linkedin.com/in/rafaelalucas/"
          className={`${styles.bg_links} ${styles.logo}`}
        />
      </div>
    </div>
  );
};

export default Footer;
