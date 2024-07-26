// src/components/UploadPurchase.js
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const PurchaseDetails = () => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shopName, setShopName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "purchases"), {
        productName,
        quantity: Number(quantity),
        shopName,
        price: Number(price),
      });
      alert("Purchase details uploaded successfully!");
      setProductName("");
      setQuantity("");
      setShopName("");
      setPrice("");
    } catch (error) {
      console.error("Error uploading purchase details: ", error);
      alert("Failed to upload purchase details.");
    }
  };

  return (
    <div>
      <h1>Upload Purchase Details</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Purchase Shop Name:</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default PurchaseDetails;
