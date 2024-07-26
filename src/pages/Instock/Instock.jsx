// src/components/SellProduct.js
import React, { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const Instock = () => {
  const [productId, setProductId] = useState("");
  const [quantityToSell, setQuantityToSell] = useState("");

  const handleSell = async (e) => {
    e.preventDefault();

    try {
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const productData = productSnap.data();
        const newStock = productData.stock - Number(quantityToSell);

        if (newStock >= 0) {
          await updateDoc(productRef, { stock: newStock });
          alert("Product sold and stock updated successfully!");
        } else {
          alert("Not enough stock to sell this quantity!");
        }
      } else {
        alert("Product not found!");
      }

      setProductId("");
      setQuantityToSell("");
    } catch (error) {
      console.error("Error updating stock: ", error);
      alert("Failed to update stock.");
    }
  };

  return (
    <div>
      <h1>Sell Product</h1>
      <form onSubmit={handleSell}>
        <div>
          <label>Product ID:</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity to Sell:</label>
          <input
            type="number"
            value={quantityToSell}
            onChange={(e) => setQuantityToSell(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sell</button>
      </form>
    </div>
  );
};

export default Instock;
