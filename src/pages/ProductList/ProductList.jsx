import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, storage } from "../firebase";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import "./ProductList.css";
import { useNavigate } from 'react-router-dom';
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollectionRef = collection(db, "products");
      const q = query(productsCollectionRef, where("name", ">=", searchTerm));

      try {
        const querySnapshot = await getDocs(q);
        const fetchedProducts = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const imageUrl = await getImageUrl(doc.id);
          return {
            id: doc.id,
            imageUrl,
            ...doc.data(),
            expanded: false,
          };
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDescription = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          expanded: !product.expanded,
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };
  const handleBulkUploadClick = () => {
    navigate('/bulkupload'); // Replace with the path you want to navigate to
  };
  const handleNewProductdClick = () => {
    navigate('/add'); // Replace with the path you want to navigate to
  };
  const getImageUrl = async (productId) => {
    try {
      const storageRef = ref(storage, `images/${productId}.jpg`);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error getting image URL: ", error);
      return "";
    }
  };

  const deleteProduct = async (productId, event) => {
    event.stopPropagation();

    try {
      await deleteDoc(doc(db, "products", productId));
      const storageRef = ref(storage, `images/${productId}.jpg`);
      await deleteObject(storageRef);

      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const handleSelectProduct = (event, productId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
    setSelectAll(!selectAll);
  };

  const bulkDeleteProducts = async () => {
    const promises = selectedProducts.map(async (productId) => {
      try {
        await deleteDoc(doc(db, "products", productId));
        const storageRef = ref(storage, `images/${productId}.jpg`);
        await deleteObject(storageRef);
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    });

    await Promise.all(promises);
    setProducts((prevProducts) =>
      prevProducts.filter((product) => !selectedProducts.includes(product.id))
    );
    setSelectedProducts([]);
    setSelectAll(false);
  };

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Product List</h2>
      <input
        type="text"
        className="product-list-input"
        placeholder="Search products"
        value={searchTerm}
        onChange={handleSearch}
      />
      {/* <button className="bulk-delete-button" onClick={bulkDeleteProducts}>
        <i className="fas fa-trash-alt"></i> Bulk Delete
      </button>
      <button className="select-all-button" onClick={handleSelectAll}>
        {selectAll ? "Deselect All" : "Select All"}
      </button>
       */}
       {/* <div className="button-row">
  <button className="select-all-button" onClick={handleSelectAll}>
    {selectAll ? "Deselect All" : "Select All"}
  </button>
  <button className="bulk-delete-button" onClick={bulkDeleteProducts}>
    <i className="fas fa-trash-alt"></i> Bulk Delete
  </button>
  <button className="bulk-delete-button" onClick={handleNewProductdClick} style={{position:"relative",left:"740px"}}>
    <i className="fa fa-plus-circle"></i> New
  </button>
  <button className="bulk-delete-button" onClick={handleBulkUploadClick} style={{position:"relative",left:"740px"}}>
    <i className="fa fa-upload"></i> Bulk Upload
  </button>
</div> */}
<div className="button-row">
      <button className="select-all-button" onClick={handleSelectAll}>
        {selectAll ? "Deselect All" : "Select All"}
      </button>
      <button className="bulk-delete-button" onClick={bulkDeleteProducts}>
        <i className="fas fa-trash-alt"></i> Bulk Delete
      </button>
      <button className="bulk-new-button" onClick={handleNewProductdClick} style={{ position: "relative", left: "600px" }}>
        <i className="fa fa-plus-circle"></i> New
      </button>
      <button className="bulk-upload-button" onClick={handleBulkUploadClick} style={{ position: "relative", left: "610px" }}>
        <i className="fa fa-upload"></i> Bulk Upload
      </button>
    </div>

      {/* <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <input
              type="checkbox"
              className="product-checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={(event) => handleSelectProduct(event, product.id)}
            />
            <div className="product-info" onClick={() => toggleDescription(product.id)}>
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="product-details">
                <div className="product-name">{product.name}</div>
                {product.expanded && (
                  <div className="product-description">{product.description}</div>
                )}
                <div className="product-price">Price: ₹{product.price.toFixed(2)}</div>
              </div>
            </div>
            <div className="product-actions">
              <Link to={`/edit-product/${product.id}`}>
                <button className="edit-button">
                  <i className="fas fa-edit"></i> Edit
                </button>
              </Link>
              <button className="delete-button" onClick={(event) => deleteProduct(product.id, event)}>
                <i className="fas fa-trash-alt"></i> Delete
              </button>
            </div>
          </li>
        ))}
      </ul> */}<br></br><br></br>
      <ul className="product-list">
  {products.map((product) => (
    <li key={product.id} className="product-item">
      <input
        type="checkbox"
        className="product-checkbox"
        checked={selectedProducts.includes(product.id)}
        onChange={(event) => handleSelectProduct(event, product.id)}
      />
      <div className="product-info" onClick={() => toggleDescription(product.id)}>
        {/* <div className="product-image">
          <img src={product.imageUrl} alt={product.name} />
        </div> */}
        <div className="products-details">
          <div className="product-name">{product.name}</div>
          {product.expanded && (
            <div className="product-description">{product.description}</div>
          )}
          <div className="product-price">Regular price: ₹{product.regularprice.toFixed(2)}</div>
          <div className="product-price">Sales price: ₹{product.saleprice.toFixed(2)}</div>
        </div>
      </div>
      <div className="product-actions">
        <Link to={`/edit-product/${product.id}`}>
          <button className="edit-button">
            <i className="fas fa-edit"></i> Edit
          </button>
        </Link>
        <button className="delete-button" onClick={(event) => deleteProduct(product.id, event)}>
          <i className="fas fa-trash-alt"></i> Delete
        </button>
      </div>
    </li>
  ))}
</ul>
    </div>
  );
};

export default ProductList;
