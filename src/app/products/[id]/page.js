"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import styles from "./ProductDetail.module.css";
import videoData from "../data.json";

export default function ProductDetailPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch(`http://makeup-api.herokuapp.com/api/v1/products/${id}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setVideos(videoData[data.product_type] || []);
      })
      .catch((error) => setError(error.message));
  }, [id]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!product) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        &larr; Back
      </button>

      <div className={styles.productCard}>
        <img
          src={product.image_link}
          alt={product.name}
          className={styles.image}
        />

        <div className={styles.productInfo}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.brand}>Brand: {product.brand}</p>
          <p className={styles.price}>
            Price: {product.price ? `$${product.price}` : "Unavailable"}
          </p>
          <p className={styles.description}>
            {product.description || "No description available"}
          </p>
        </div>
      </div>

      <div className={styles.colorSection}>
        <h3 className={styles.sectionTitle}>Available Colors:</h3>
        <div className={styles.colorPalette}>
          {product.product_colors?.map((color, index) => (
            <div
              key={index}
              className={styles.colorCircle}
              style={{ backgroundColor: color.hex_value }}
              title={color.colour_name}
            />
          ))}
        </div>
      </div>

      <div className={styles.videoSection}>
        <h2 className={styles.sectionTitle}>
          How to Use {product.product_type}
        </h2>
        <div className={styles.videoContainer}>
          {videos.map((video) => (
            <div key={video.id} className={styles.videoWrapper}>
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p className={styles.videoTitle}>{video.title}</p>
              <p className={styles.videoDescription}>{video.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
