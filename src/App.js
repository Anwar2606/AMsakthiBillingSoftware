// // src/App.js
// import React, { useState } from 'react';
// import '../src/App.css';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import AddProduct from './pages/AddProduct';
// import ProductList from './pages/ProductList';
// import InvoicePDF from './pages/Invoice';
// import { db } from './pages/firebase';
// import BillingCalculator from './pages/BillingCalculator';

// const App = () => {
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [invoiceData, setInvoiceData] = useState(null);

//   const handleProductSelect = (product) => {
//     const existingProduct = selectedProducts.find(p => p.id === product.id);
//     if (existingProduct) {
//       setSelectedProducts(
//         selectedProducts.map(p =>
//           p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
//         )
//       );
//     } else {
//       setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
//     }
//   };

//   const handleGenerateInvoice = () => {
//     const products = selectedProducts.map(product => ({
//       ...product,
//       total: product.price * product.quantity * (1 - product.discount / 100) * 1.18, // Apply discount and GST
//     }));

//     const total = products.reduce((acc, product) => acc + product.total, 0);
//     setInvoiceData({ products, total });
//   };

//   return (
//     <Router>
//       <div>
//         <h1>POS System</h1>
//         <nav>
//           <ul>
//             <li>
//               <button className='glow-on-hover' ><Link to="/add" style={{color:"white",textDecoration:"none",fontWeight:"bolder"}}>Add Product</Link></button>
//             </li>
//             <li>
//               <Link to="/products">Products</Link>
//             </li>
//             <li>
//               <Link to="/bill">BillingCalculator</Link>
//             </li>
//           </ul>
//         </nav>
//         <Routes>
//           <Route path="/add" element={<AddProduct />} />
//           <Route path="/bill" element={<BillingCalculator />} />
//           <Route path="/products" element={
//             <>
//               <ProductList onSelect={handleProductSelect} />
//               <button onClick={handleGenerateInvoice}>Generate Invoice</button>
//               {invoiceData && <InvoicePDF invoiceData={invoiceData} />}
//             </>
//           } />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AddProduct from './pages/Add Product/AddProduct';
import ProductList from './pages/ProductList/ProductList';
import InvoicePDF from './pages/Invoice';
import { db } from './pages/firebase';
import BillingCalculator from './pages/Dashboard/BillingCalculator';
import Navbar from './pages/Navbar/Navbar';
import './App.css';
import MultipleProducts from './pages/MultipleProducts/MultipleProducts';
import BulkUpload from './pages/BulkUpload/BulkUpload';
import EditProductPage from './pages/EditProduct/EditProduct';
import TodaySales from './pages/TodaySales/TodaySales';
import GraphComponent from './pages/Chart/SalesComparisonChart';
import HomePage from './pages/Home/HomePage';

import Grid from './pages/Grid/Grid';
import PurchaseDetails from './pages/PurchaseDetails/PurchaseDetails';
import Instock from './pages/Instock/Instock';
import MySales from './pages/MySales/MySales';
import CustomerDetails from './pages/CustomerDetails/CustomerDetails';
import LoginPage from './pages/Login/LoginPage';



const App = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  

  const handleProductSelect = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleGenerateInvoice = () => {
    const products = selectedProducts.map(product => ({
      ...product,
      total: product.price * product.quantity * (1 - product.discount / 100) * 1.18, // Apply discount and GST
    }));

    const total = products.reduce((acc, product) => acc + product.total, 0);
    setInvoiceData({ products, total });
  };
  const location = useLocation();

  // Determine if the current path is the login page
  const isLoginPage = location.pathname === '/';

  return (
    
      <div>
      {!isLoginPage && <Navbar />}
        <Routes>
        <Route path="/todaysales" element={<TodaySales />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/mysales" element={<MySales />} />
          <Route path="/instock" element={<Instock />} />
          <Route path="/purchase" element={<PurchaseDetails />} />
          <Route path="/customer-details" element={<CustomerDetails />} />
          <Route path="/grid" element={<Grid />} />
          <Route path="/graph" element={<GraphComponent />} />
          <Route path="/bill" element={<BillingCalculator />} />
          <Route path="/multipleproducts" element={<MultipleProducts />} />
          <Route path="/bulkupload" element={<BulkUpload />} />
          <Route path="/products" element={<ProductList />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />
        <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={
            <>
              <ProductList onSelect={handleProductSelect} />
            </>
          } />
        </Routes>
      </div>
   
  );
};

export default App;
