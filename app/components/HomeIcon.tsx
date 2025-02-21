import Link from "next/link";
import styles from "@/styles/page.module.css";

const HomeButton: React.FC = () => {
  return (
    <div className={styles.homeButton}>
      <Link href="/" passHref>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="white"
          >
            <path
              d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
            />
          </svg>
      </Link>
    </div>
  );
};

export default HomeButton;
