import React from 'react';
import Link from 'next/link';
import styles from '@/styles/page.module.css'; // Ensure this path is correct

interface BackIconProps {
  link: string;
}

const BackIcon: React.FC<BackIconProps> = ({ link }) => {
  return (
    <div className={styles.backButton}>
      <Link href={link} passHref>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
        >
        <path d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z" />
        </svg>
      </Link>
    </div>
  );
};

export default BackIcon;