// src/components/ProductForm.js
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./MultipleProducts.css"; // Import the CSS file

const ProductForm = () => {
  const [product, setProduct] = useState({ name: "", price: "", quantity: "", image: null });
  const [submittedProducts, setSubmittedProducts] = useState([]);

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: name === "image" ? files[0] : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const productCollection = collection(db, "products");

    let imageUrl = "";
    if (product.image) {
      const imageRef = ref(storage, `images/${product.image.name}`);
      await uploadBytes(imageRef, product.image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = await addDoc(productCollection, {
      name: product.name,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity),
      imageUrl: imageUrl,
    });

    setSubmittedProducts(prevProducts => [
      ...prevProducts,
      {
        id: docRef.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        imageUrl: imageUrl,
      }
    ]);

    setProduct({ name: "", price: "", quantity: "", image: null });
  };

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={product.quantity}
              onChange={handleInputChange}
            />
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="list-container">
        <h2>Submitted Products</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {submittedProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="product-image"/> : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductForm;
