import { NextPage } from "next";
import styles from "@/utils/sass/footer.module.scss"; // Assuming this is the correct path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";

interface Props {}

const Footer: NextPage<Props> = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.about}>
        <a
          className={`${styles.bg_links} ${styles.social} ${styles.portfolio}`}
          href="https://www.rafaelalucas.com"
          target="_blank"
        >
          <span className={styles.icon}></span>
        </a>
        <a
          className={`${styles.bg_links} ${styles.social} ${styles.dribbble}`}
          href="https://dribbble.com/rafaelalucas"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.icon}></span>
        </a>
        <a
          className={`${styles.bg_links} ${styles.social} ${styles.linkedin}`}
          href="https://www.linkedin.com/in/rafaelalucas/"
          target="_blank"
        >
          <span className={styles.icon}></span>
        </a>
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
