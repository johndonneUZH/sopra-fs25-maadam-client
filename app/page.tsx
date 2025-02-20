"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "antd";
import { BookOutlined, CodeOutlined, GlobalOutlined } from "@ant-design/icons";
import styles from "@/styles/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";

export default function Home() {
  const router = useRouter();
  return (
    <div className={styles.page}>
      <Navbar names={["Login", "Register", "About me"]} 
              links={[() => router.push("/login"), () => router.push("/register"), "https://www.linkedin.com/in/matteo-iulian-adam-16355a225"]} />        
      
      
      
      <main className={styles.main}>
        <h1 className={styles.centeredText}>Welcome to Matteo's website!</h1>
        <Carousel num={6}></Carousel>
      </main>

      <footer className={styles.footer}>
        <Button
          type="link"
          icon={<BookOutlined />}
          href="https://lms.uzh.ch/dmz/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OLAT
        </Button>
        <Button
          type="link"
          icon={<CodeOutlined />}
          href="https://moodle-app2.let.ethz.ch/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Moodle
        </Button>
      </footer>
    </div>
  );
}
