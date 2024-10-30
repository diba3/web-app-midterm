"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function HomePage() {
  const router = useRouter();

  const navigateToProducts = () => {
    router.push("/products");
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <h1 className={styles.heading}>Exactly what you’re looking for.</h1>
      </nav>
      <div className={styles.content}>
        <img src="/cat.png" alt="Cute pink cat" className={styles.catImage} />
        <div className={styles.textContainer}>
          <p className={styles.description}>
            Step into a world of beauty tailored to your style.
          </p>
          <button onClick={navigateToProducts} className={styles.button}>
            Start Looking!
          </button>
        </div>
      </div>
    </div>
  );
}
