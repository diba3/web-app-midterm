"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Products.module.css";

export default function ProductsPage() {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://makeup-api.herokuapp.com/api/v1/products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product types");
        }
        return response.json();
      })
      .then((data) => {
        const types = [...new Set(data.map((product) => product.product_type))];
        setProductTypes(types);
      })
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    if (selectedType) {
      fetch(
        `http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${selectedType}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          return response.json();
        })
        .then((data) => setProducts(data))
        .catch((error) => setError(error.message));
    }
  }, [selectedType]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>Product Types</h2>
        <ul className={styles.typeList}>
          {productTypes.map((type) => (
            <li
              key={type}
              className={styles.typeItem}
              onClick={() => setSelectedType(type)}
            >
              {type.replace("_", " ")}
            </li>
          ))}
        </ul>
      </aside>
      <main className={styles.main}>
        <h2 className={styles.mainTitle}>
          {selectedType
            ? `Products: ${selectedType.replace("_", " ")}`
            : "Select a Product Type"}
        </h2>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className={styles.productCard}>
                <img
                  src={product.image_link || "/sample.jpg"}
                  alt={product.name}
                  className={styles.productImage}
                />
                <h4 className={styles.productName}>{product.name}</h4>
                <p className={styles.productBrand}>{product.brand}</p>
                <p className={styles.productPrice}>
                  {product.price ? `$${product.price}` : "Price Unavailable"}
                </p>
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
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
