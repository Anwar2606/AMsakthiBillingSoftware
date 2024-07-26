// // src/components/AddProduct.js
// import React, { useState } from 'react';
// import { db } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';

// const AddProduct = () => {
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [quantity, setQuantity] = useState('');

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(db, 'products'), {
//         name,
//         price: parseFloat(price),
//         quantity: parseInt(quantity),
//         discount: 0,
//       });
//       setName('');
//       setPrice('');
//       setQuantity('');
//       alert('Product added successfully!');
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }
//   };

//   return (
//     <div>
//       <h2>Add Product</h2>
//       <form onSubmit={handleAddProduct}>
//         <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
//         <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
//         <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required />
//         <button type="submit">Add Product</button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;
// import React, { useState } from 'react';
// import { db } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import './Addproduct.css';

// const AddProduct = () => {
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [quantity, setQuantity] = useState('');

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(db, 'products'), {
//         name,
//         price: parseFloat(price),
//         quantity: parseInt(quantity),
//         discount: 0,
//       });
//       setName('');
//       setPrice('');
//       setQuantity('');
//       alert('Product added successfully!');
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }
//   };

//   return (
//     <div className="add-product-container">
//       <h2>Add Product</h2>
//       <form onSubmit={handleAddProduct}>
//         <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
//         <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
//         <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required />
//         <button type="submit">Add Product</button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;
// import React, { useState } from 'react';
// import { db } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import './Addproduct.css'; // Import the CSS file

// const AddProduct = () => {
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [quantity, setQuantity] = useState('');

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(db, 'products'), {
//         name,
//         price: parseFloat(price),
//         quantity: parseInt(quantity),
//         discount: 0,
//       });
//       setName('');
//       setPrice('');
//       setQuantity('');
//       alert('Product added successfully!');
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }
//   };

//   return (
//     <div className="add-product-page">
//       <div className="add-product-container">
//         <h2>Add Product</h2>
//         <form onSubmit={handleAddProduct} className="add-product-form">
//           <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
//           <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
//           <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required />
//           <button type="submit">Add Product</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;


import React, { useState } from 'react';
import { db, storage } from '../firebase'; // Import the initialized firebase instance with Firestore and Storage
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Addproduct.css'; // Import the CSS file

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null); // State to hold the selected image file

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Step 1: Upload the image to Firebase Storage
    try {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);

      // Step 2: Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);

      // Step 3: Add product details including the image URL to Firestore
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        imageUrl, // Add the image URL to Firestore
        discount: 0,
      });

      // Step 4: Clear form fields and state
      setName('');
      setPrice('');
      setQuantity('');
      setImage(null);
      alert('Product added successfully!');
      window.location.reload();
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <h2>Add Product</h2>
        <form onSubmit={handleAddProduct} className="add-product-form">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required />
          <input type="file" onChange={handleImageChange} accept="image/*" required /> {/* File input for image upload */}
          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
