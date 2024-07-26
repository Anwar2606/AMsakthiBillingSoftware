import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import the initialized firebase instance
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './BillingCalculator.css'; // Import the CSS file

const BillingCalculator = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [billingDetails, setBillingDetails] = useState({
    totalAmount: 0,
    discountPercentage: '',
    discountedTotal: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    grandTotal: 0,
  });
  const [customerName, setCustomerName] = useState('');
  const [customerState, setCustomerState] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerGSTIN, setCustomerGSTIN] = useState('');
  const [customerPAN, setCustomerPAN] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [businessState, setBusinessState] = useState('YourBusinessState');
  const [searchTerm, setSearchTerm] = useState('');
  const [taxOption, setTaxOption] = useState('cgst_sgst');
  const [currentDate, setCurrentDate] = useState(new Date()); // State for current date
  const [showCustomerDetails, setShowCustomerDetails] = useState(false); // State for toggling customer details

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollectionRef = collection(db, 'products');
      try {
        const querySnapshot = await getDocs(productsCollectionRef);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    const updatedCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
    );
    setCart(updatedCart);
    updateBillingDetails(updatedCart);
  };

  const updateBillingDetails = (updatedCart) => {
    const totalAmount = updatedCart.reduce((total, item) => {
      return total + (item.saleprice * item.quantity);
    }, 0);

    const discountPercentage = parseFloat(billingDetails.discountPercentage) || 0;
    const discountedTotal = totalAmount * (1 - discountPercentage / 100);

    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (taxOption === 'cgst_sgst') {
      if (customerState === businessState) {
        cgstAmount = discountedTotal * 0.09;
        sgstAmount = discountedTotal * 0.09;
      } else {
        cgstAmount = discountedTotal * 0.09;
        sgstAmount = discountedTotal * 0.09;
      }
    } else if (taxOption === 'igst') {
      igstAmount = discountedTotal * 0.18;
    }

    const grandTotal = discountedTotal + cgstAmount + sgstAmount + igstAmount;

    setBillingDetails(prevState => ({
      ...prevState,
      totalAmount,
      discountedTotal,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grandTotal,
    }));
  };

  const handleDiscountChange = (event) => {
    const discountPercentage = event.target.value;
    setBillingDetails(prevState => ({
      ...prevState,
      discountPercentage,
    }));
  };
  const ClearAllData =() => {
    window.location.reload();
  };

  useEffect(() => {
    updateBillingDetails(cart);
  }, [billingDetails.discountPercentage, customerState, taxOption]);

  const generateRandomInvoiceNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit number
  };

  const handleSave = async () => {
    // Save billing details
    const invoiceNumber = generateRandomInvoiceNumber();
    const billingDocRef = collection(db, 'billing');
    try {
      await addDoc(billingDocRef, {
        ...billingDetails,
        customerName,
        customerAddress,
        customerState,
        customerPhone,
        customerEmail,
        customerGSTIN,
        date: Timestamp.fromDate(currentDate),
        productsDetails: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          saleprice: item.saleprice,
          quantity: item.quantity
        })),
        createdAt: Timestamp.now(),
        invoiceNumber,
      });
      console.log('Billing details saved successfully in Firestore');
    } catch (error) {
      console.error('Error saving billing details: ', error);
    }
   
    // Generate and save PDF invoice
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Draw border

 doc.addImage(imgData, 'JPEG', 16, 18, 29, 29);

    // Set font size
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0);  
    // Set font to bold and add the text
    doc.setFont('helvetica', 'bold');
    doc.text('A.M.SAKTHI PYROPARK', 44, 21);
    doc.setTextColor(0, 0, 0);
    // Reset font to normal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    // Add the rest of the text
    doc.text('A.G.P.POLITECNIC OFF SIDE 3/299D,', 44, 28);
    doc.text('Sivakasi prinding collage, mela, Amathur', 44, 35);
    doc.setFontSize(9);
    doc.text('Phone no.: +91 81100 85110', 44, 42);
   doc.text('State: 33-Tamil Nadu', 44, 49);
   doc.setFontSize(10);
    doc.setTextColor(255, 0, 0);  
    // Set font to bold and add the text
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE ', 138, 22);
    doc.text('TRANSPORT COPY', 138, 29);
    doc.setTextColor(0, 0, 0);
    // Reset font to normal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
      doc.text(`Date: ${currentDate.toLocaleDateString()}`, 138, 36);
      doc.text(`Invoice Number:${invoiceNumber}`, 138, 43);
      doc.setFont('helvetica', 'bold');
      doc.text('GSTIN: 33AEGFS0424L1Z4', 138, 49);
      doc.setFont('helvetica', 'normal');
       // doc.text('Email: support@amsakthipyropark.com', 138, 56);
    // Draw the rectangle
    doc.rect(14, 15, 182, 40);
    //Next rectangle
    doc.setFontSize(12);
    doc.setTextColor(170, 51, 106);  
    // Set font to bold and add the text
    doc.setFont('helvetica', 'bold');
    doc.text('BILLED TO', 19, 65);
    doc.setTextColor(0, 0, 0);
    // Reset font to normal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    // Add the rest of the text
    // doc.text(`Name: ${customerName}`, 23, 81);
    // doc.text(`Address: ${customerAddress}`, 23, 90);
    // doc.text(`State: ${customerState}`, 23,97);
    // doc.text(`Phone: ${customerPhone}`, 23, 104);
    // doc.text(`Email: ${customerEmail}`, 23, 111);
    // Define the starting coordinates and line height
    const startX = 23;
    let startY = 71;
    const lineHeight = 8; // Adjust line height as needed
    
    // Define the labels and values
    const labels = [
      'Name',
      'Address',
      'State',
      'Phone',
      'GSTIN',
      'PAN'
    ];
    
    const values = [
      customerName,
      customerAddress,
      customerState,
      customerPhone,
      customerGSTIN,
      customerPAN
    ];
    
    // Calculate the maximum width of the labels without the colon
    const maxLabelWidth = Math.max(...labels.map(label => doc.getTextWidth(label)));
    
    // Define the colon offset and max line width
    const colonOffset = 2; // Adjust the space between label and colon
    const maxLineWidth = 160; // Maximum width for the values
    const maxTextWidth = 104; // Maximum allowed width for the text line
    
    // Add the text with proper alignment
    labels.forEach((label, index) => {
      const labelText = label;
      const colonText = ':';
      const valueText = values[index];
    
      // Calculate positions
      const colonX = startX + maxLabelWidth + colonOffset;
      const valueX = colonX + doc.getTextWidth(colonText) + colonOffset;
    
      // Split the value text if it exceeds the max text width
      const splitValueText = doc.splitTextToSize(valueText, maxTextWidth - valueX);
    
      // Draw the label and colon
      doc.text(labelText, startX, startY);
      doc.text(colonText, colonX, startY);
    
      // Draw the split value text
      splitValueText.forEach((line, lineIndex) => {
        doc.text(line, valueX, startY + (lineIndex * lineHeight));
      });
    
      // Move to the next line
      startY += lineHeight * splitValueText.length;
    });
    

   
doc.setFontSize(12);
doc.setTextColor(170, 51, 106);  
// Set font to bold and add the text
doc.setFont('helvetica', 'bold');
doc.text('SHIPPED TO', 105, 65);
doc.setFont('helvetica', 'normal');
doc.setTextColor(0, 0, 0);
doc.setFontSize(9);
const initialX = 110;
let initialY = 71;
const lineSpacing = 8;  // Adjust line height as needed
const spacingBetweenLabelAndValue = 3; // Space between colon and value
const maxValueWidth = 65; // Maximum allowed width for the value text line

// Define the labels and values
const labelTexts = [
  'Name',
  'Address',
  'State',
  'Phone',
  'GSTIN',
  'PAN'
];

const valuesTexts = [
  customerName,
  customerAddress,
  customerState,
  customerPhone,
  customerGSTIN,
  customerPAN,
];

// Calculate the maximum width of the labels
const maxLabelTextWidth = Math.max(...labelTexts.map(label => doc.getTextWidth(label)));

// Calculate the width of the colon
const colonWidth = doc.getTextWidth(':');

// Calculate positions
labelTexts.forEach((labelText, index) => {
  const valueText = valuesTexts[index];
  
  // Calculate the position for the colon
  const labelWidth = doc.getTextWidth(labelText);
  const colonX = initialX + maxLabelTextWidth + (colonWidth / 2);

  // Position the value
  const valueX = colonX + colonWidth + spacingBetweenLabelAndValue;

  // Split the value text if it exceeds the max text width
  const splitValueText = doc.splitTextToSize(valueText, maxValueWidth);

  // Draw the label and colon
  doc.text(labelText, initialX, initialY);
  doc.text(':', colonX, initialY); // Draw the colon

  // Draw the split value text
  splitValueText.forEach((line, lineIndex) => {
    doc.text(line, valueX, initialY + (lineIndex * lineSpacing));
  });

  // Move to the next line
  initialY += lineSpacing * splitValueText.length;
});

    // Draw the rectangle
    doc.rect(14, 58, 182, 66);
  
    // Prepare Table Body
    const tableBody = cart
      .filter(item => item.quantity > 0)
      .map(item => [
        item.name,
        item.quantity.toString(),
        `Rs. ${item.saleprice.toFixed(2)}`,
        `Rs. ${(item.saleprice * item.quantity).toFixed(2)}`
      ]);
  
    // Add Summary Rows
    tableBody.push(
      [
        { content: 'Total Amount:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
        { content: `Rs. ${billingDetails.totalAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ],
      [
        { content: `Discount (${billingDetails.discountPercentage}%):`, colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
        { content: `Rs. ${(billingDetails.totalAmount * (parseFloat(billingDetails.discountPercentage) / 100) || 0).toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ],
      [
        { content: 'Discounted Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
        { content: `Rs. ${billingDetails.discountedTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ]
    );
  
    if (taxOption === 'cgst_sgst') {
      tableBody.push(
        [
          { content: 'CGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
          { content: `Rs. ${billingDetails.cgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
        ],
        [
          { content: 'SGST (9%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
          { content: `Rs. ${billingDetails.sgstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
        ]
      );
    } else if (taxOption === 'igst') {
      tableBody.push(
        [
          { content: 'IGST (18%):', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
          { content: `Rs. ${billingDetails.igstAmount.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
        ]
      );
    }
  
    tableBody.push(
      [
        { content: 'Grand Total:', colSpan: 3, styles: { halign: 'right', fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } },
        { content: `Rs. ${billingDetails.grandTotal.toFixed(2)}`, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' } }
      ]
    );
  
    // Add Table with Reduced Border Thickness
    doc.autoTable({
      head: [['Product Name', 'Quantity', 'Price', 'Total']],
      body: tableBody,
      startY: 130,
      theme: 'grid',
      headStyles: { fillColor: [255, 182, 193], textColor: [0, 0, 139], lineWidth: 0.2, lineColor: [0, 0, 0] }, // Reduced lineWidth
      bodyStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.2, lineColor: [0, 0, 0] }, // Reduced lineWidth
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
 
    doc.save(`invoice_${invoiceNumber}.pdf`);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    setFilteredProducts(
      products.filter(product => {
        const productName = product.name ? product.name.toLowerCase() : '';
        const productCode = product.productcode ? product.productcode.toLowerCase() : '';

        return productName.includes(term) || productCode.includes(term);
      })
    );
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      updateBillingDetails(updatedCart);
    } else {
      const newItem = {
        productId: product.id,
        name: product.name,
        saleprice: product.saleprice,
        quantity: 1,
      };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      updateBillingDetails(updatedCart);
    }
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    setCart(updatedCart);
    updateBillingDetails(updatedCart);
  };

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setCurrentDate(selectedDate);
  };

  return (
    <div className="billing-calculator">
      <div className="product-list">
        <input
          type="text"
          placeholder="Search Products"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <ul>
          {filteredProducts.map(product => (
            <li key={product.id}>
              <div className="product-details">
                <span>{product.name}</span>
                
                <span> {`(Sales Rs. ${product.saleprice ? product.saleprice.toFixed(2) : '0.00'})`}</span>
              </div>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="cart">
        <h2>Cart</h2>
        <button className="remove-button" style={{display:"flex",position:"relative",left:"540px",bottom:"34px"}} onClick={() => ClearAllData()}>Clear cart</button>
        <ul>
          {cart.map(item => (
            <li key={item.productId}>
              <div className="cart-item">
                <span>{item.name}</span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                />
                <span>Rs. {item.saleprice ? (item.saleprice * item.quantity).toFixed(2) : '0.00'}</span>
                <button className="remove-button" onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="billing-summary">
          <div className="billing-details">
            <label>Discount (%)</label>
            <input
              type="number"
              value={billingDetails.discountPercentage}
              onChange={handleDiscountChange}
              min="0"
              max="100"
            />
            <label>Date</label>
            <input
              type="date"
              className="custom-datepicker"
              value={currentDate.toISOString().substr(0, 10)} // Display date in ISO format for input field
              onChange={handleDateChange}
            />
            <br />
            <br />
            <label>Tax Option</label>
          <select value={taxOption} onChange={(e) => setTaxOption(e.target.value)}>
            <option value="cgst_sgst">CGST + SGST</option>
            <option value="igst">IGST</option>            
            <option value="no_tax">No Tax</option>
          </select>
          </div>
          <div className="billing-amounts">
          <table>
            <tbody>
              <tr>
                <td>Total Amount:</td>
                <td>Rs. {billingDetails.totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Discounted Total:</td>
                <td>Rs. {billingDetails.discountedTotal.toFixed(2)}</td>
              </tr>
              {taxOption === 'cgst_sgst' && (
                <>
                  <tr>
                    <td>CGST (9%):</td>
                    <td>Rs. {billingDetails.cgstAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>SGST (9%):</td>
                    <td>Rs. {billingDetails.sgstAmount.toFixed(2)}</td>
                  </tr>
                </>
              )}
              {taxOption === 'igst' && (
                <tr>
                  <td>IGST (18%):</td>
                  <td>Rs. {billingDetails.igstAmount.toFixed(2)}</td>
                </tr>
              )}
              <tr className="grand-total-row">
                <td>Grand Total:</td>
                <td>Rs. {billingDetails.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
        <div className="customer-details-toggle">
          <button onClick={() => setShowCustomerDetails(!showCustomerDetails)}>
            {showCustomerDetails ? 'Hide Customer Details' : 'Show Customer Details'}
          </button>
        </div>
        {showCustomerDetails && (
          <div className="customer-details">
            <div>
              <label>Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <label>Customer Address</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
            <div>
              <label>Customer State</label>
              <input
                type="text"
                value={customerState}
                onChange={(e) => setCustomerState(e.target.value)}
              />
            </div>
            <div>
              <label>Customer Phone</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <div>
              <label>Customer GSTIN</label>
              <input
                type="text"
                value={customerGSTIN}
                onChange={(e) => setCustomerGSTIN(e.target.value)}
              />
            </div>
            <div>
              <label>Customer PAN</label>
              <input
                type="text"
                value={customerPAN}
                onChange={(e) => setCustomerPAN(e.target.value)}
              />
            </div>
            <div>
              <label>Customer Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </div>
        )}
        <button onClick={handleSave}>Save and Generate PDF</button>
      </div>
    </div>
  );
};

export default BillingCalculator;