import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../pages/firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SalesComparisonChart from '../Chart/SalesComparisonChart';
import Grid from '../Grid/Grid';
import './HomePage.css';

const Homepage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingDetail, setEditingDetail] = useState(null); // Track currently editing detail

  const fetchDetails = async () => {
    setLoading(true);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);

    const detailsQuery = query(
      collection(db, 'billing'),
      where('date', '>=', startTimestamp),
      where('date', '<=', endTimestamp)
    );

    try {
      const querySnapshot = await getDocs(detailsQuery);
      const detailsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDetails(detailsData);
    } catch (error) {
      console.error('Error fetching details: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [selectedDate]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'billing', id));
      setDetails(prevDetails => prevDetails.filter(detail => detail.id !== id));
      console.log('Document successfully deleted!');
      fetchDetails(); // Fetch details again after deletion
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleEdit = (detail) => {
    setEditingDetail(detail); // Set the detail currently being edited
  };

  const handleSave = async () => {
    try {
      const { id, customerName, totalAmount } = editingDetail;
      await updateDoc(doc(db, 'billing', id), {
        customerName,
        totalAmount
      });
      console.log('Document successfully updated!');
      setEditingDetail(null); // Clear editing state
      fetchDetails(); // Fetch details again after update
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Customer Name', 'Phone No', 'Email ID', 'Purchase Details', 'CGST', 'SGST', 'IGST','Grand Total'];
    const tableRows = [];

    details.forEach((detail) => {
      const detailData = [
        detail.customerName,
        detail.customerPhone || 'N/A',
        detail.customerEmail || 'N/A',
        
        `Rs.${detail.totalAmount ? detail.totalAmount.toFixed(0) : 'N/A'}`,
        `Rs.${detail.cgstAmount ? detail.cgstAmount.toFixed(0) : 'N/A'}`,
        `Rs.${detail.sgstAmount ? detail.sgstAmount.toFixed(0) : 'N/A'}`,
        `Rs.${detail.igstAmount ? detail.igstAmount.toFixed(0) : 'N/A'}`,
       `Rs.${detail.grandTotal ? detail.grandTotal.toFixed(0) : 'N/A'}`,
      ];
      tableRows.push(detailData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text('Details by Date', 14, 15);
    doc.save('details.pdf');
  };

  const handleCancelEdit = () => {
    setEditingDetail(null); // Clear editing state
  };

  const handleGeneratePDF = (detail) => {
    const doc = new jsPDF();
    const currentDate = new Date();   
    // doc.setFontSize(14);
    // doc.text('Invoice Details', 14, 20);
    // doc.setFontSize(12);
    // doc.text(`Customer Name: ${detail.customerName}`, 14, 28);
    // doc.text(`Invoice Number: ${detail.invoiceNumber}`, 14, 36);
    const imgData='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'
     doc.addImage(imgData, 'JPEG', 10, 10, 30, 30);
    doc.setFontSize(14);
    doc.text('Tamizha Software solutions', 40, 20);
    doc.setFontSize(10);
    doc.text('Thiruthangal', 40, 28);
    doc.text('Contact: 123-456-7890', 40, 35);
    doc.text(`Invoice Number: ${detail.invoiceNumber}`, 150, 15);
    // doc.text(`Date: ${currentDate.toLocaleDateString()}`, 150, 24);
    doc.text(`Date: ${currentDate.toLocaleDateString()}`, 150, 23);
  
    doc.text(`Customer Name: ${detail.customerName}`, 150, 32);
    doc.text(`Customer State: ${detail.customerState}`, 150, 40);
  

    // Prepare table data
    const tableBody = detail.productsDetails.map(item => [
      item.name || 'N/A',
      item.quantity || 'N/A',
      `Rs.${item.price ? item.price.toFixed(2) : 'N/A'}`,
      `Rs.${item.quantity && item.price ? (item.quantity * item.price).toFixed(2) : 'N/A'}`
    ]);

    // Calculate Total Amount, Discounted Amount, and Grand Total
    const totalAmount = detail.totalAmount ? `Rs.${detail.totalAmount.toFixed(2)}` : 'N/A';
    const discountedAmount = detail.discountedTotal ? `Rs.${detail.discountedTotal.toFixed(2)}` : 'N/A';
    const grandTotal = detail.grandTotal ? `Rs.${detail.grandTotal.toFixed(2)}` : 'N/A';

    // Add table and totals to PDF
    doc.autoTable({
      head: [['Product Name', 'Quantity', 'Price', 'Total Amount']],
      body: tableBody,
      startY: 50,
      theme: 'grid', // Use 'grid' theme for borders
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: 'middle',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      },
      headStyles: {
        fillColor: [204, 204, 204],
        textColor: [0, 0, 0],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        halign: 'right',
        valign: 'middle'
      }
    });

    // Add Total Amount, Discounted Amount, and Grand Total to the table
    doc.autoTable({
      body: [
        ['Total Amount', totalAmount],
        ['Discounted Amount', discountedAmount],
        ['Grand Total', grandTotal]
      ],
      startY: doc.autoTable.previous.finalY + 10,
      theme: 'grid', // Use 'grid' theme for borders
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: 'middle',
        halign: 'center'
      },
      headStyles: {
        fillColor: [204, 204, 204],
        textColor: [0, 0, 0],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        halign: 'right',
        valign: 'middle'
      }
    });

    // Save PDF
    doc.save(`invoice_${detail.invoiceNumber}.pdf`);
  };

//   return (
//     <div>
//       <Grid />
//       <SalesComparisonChart />
//       <h2>Details By Date</h2>
//       <DatePicker
//         selected={selectedDate}
//         onChange={(date) => setSelectedDate(date)}
//         dateFormat="dd/MM/yyyy"
//         className="custom-datepicker"
//       />
//       <button onClick={handleDownloadPDF} className="download-button">Download Today's Data</button>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="table-container">
//           {details.length === 0 ? (
//             <p>No details recorded on this date.</p>
//           ) : (
//             <table className="details-table">
//               <thead>
//                 <tr>
//                   <th>Customer Name</th>
//                   <th>Discount Amount</th>
//                   <th>CGST Amount</th>
//                   <th>SGST Amount</th>
//                   <th>IGST Amount</th>
//                   <th>Total Amount</th>
//                   {/* <th>Date</th> */}
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {details.map(detail => (
//                   <tr key={detail.id}>
//                     <td>
//                       {editingDetail && editingDetail.id === detail.id ? (
//                         <input
//                           type="text"
//                           value={editingDetail.customerName}
//                           onChange={(e) => setEditingDetail({ ...editingDetail, customerName: e.target.value })}
//                         />
//                       ) : (
//                         detail.customerName
//                       )}
//                     </td>
//                     <td>₹{detail.discountedTotal ? detail.discountedTotal.toFixed(2) : 'N/A'}</td>
//                     <td>₹{detail.cgstAmount ? detail.cgstAmount.toFixed(2) : 'N/A'}</td>
//                     <td>₹{detail.sgstAmount ? detail.sgstAmount.toFixed(2) : 'N/A'}</td>
//                     <td>₹{detail.igstAmount ? detail.igstAmount.toFixed(2) : 'N/A'}</td>
//                     <td>
//                       {editingDetail && editingDetail.id === detail.id ? (
//                         <input
//                           type="text"
//                           value={editingDetail.totalAmount}
//                           onChange={(e) => setEditingDetail({ ...editingDetail, totalAmount: e.target.value })}
//                         />
//                       ) : (
//                         `₹${detail.totalAmount}`
//                       )}
//                     </td>
//                     {/* <td>{new Date(detail.date.seconds * 1000).toLocaleString()}</td> */}
//                     <td className="button-cell">
//                       {editingDetail && editingDetail.id === detail.id ? (
//                         <>
//                           <button onClick={handleSave}>Save</button>
//                           <button onClick={handleCancelEdit}>Cancel</button>
//                         </>
//                       ) : (
//                         <button onClick={() => handleEdit(detail)}><i className="fas fa-edit"></i></button>
//                       )}
//                       <button onClick={() => handleDelete(detail.id)}><i className="fas fa-trash-alt"></i></button>
//                       <button onClick={() => handleGeneratePDF(detail)}><i className="fa fa-download"></i></button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
// return (
//   <div>
//     <Grid />
//     <SalesComparisonChart />
//     <h2>Details By Date</h2>
//     <DatePicker
//       selected={selectedDate}
//       onChange={(date) => setSelectedDate(date)}
//       dateFormat="dd/MM/yyyy"
//       className="custom-datepicker"
//     />
//     <button onClick={handleDownloadPDF} className="download-button">Download Today's Data</button>
//     {loading ? (
//       <p>Loading...</p>
//     ) : (
//       <div className="table-container">
//         {details.length === 0 ? (
//           <p>No details recorded on this date.</p>
//         ) : (
//           <table className="details-table">
//             <thead>
//               <tr>
//                 <th>Customer Name</th>
//                 <th>Discount Amount</th>
//                 <th>CGST Amount</th>
//                 <th>SGST Amount</th>
//                 <th>IGST Amount</th>
//                 <th>Total Amount</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {details.map(detail => (
//                 <tr key={detail.id}>
//                   <td>
//                     {editingDetail && editingDetail.id === detail.id ? (
//                       <input
//                         type="text"
//                         value={editingDetail.customerName}
//                         onChange={(e) => setEditingDetail({ ...editingDetail, customerName: e.target.value })}
//                       />
//                     ) : (
//                       detail.customerName
//                     )}
//                   </td>
//                   <td>₹{detail.discountedTotal ? detail.discountedTotal.toFixed(2) : 'N/A'}</td>
//                   <td>₹{detail.cgstAmount ? detail.cgstAmount.toFixed(2) : 'N/A'}</td>
//                   <td>₹{detail.sgstAmount ? detail.sgstAmount.toFixed(2) : 'N/A'}</td>
//                   <td>₹{detail.igstAmount ? detail.igstAmount.toFixed(2) : 'N/A'}</td>
//                   <td>
//                     {editingDetail && editingDetail.id === detail.id ? (
//                       <input
//                         type="text"
//                         value={editingDetail.totalAmount}
//                         onChange={(e) => setEditingDetail({ ...editingDetail, totalAmount: e.target.value })}
//                       />
//                     ) : (
//                       `₹${detail.totalAmount}`
//                     )}
//                   </td>
//                   <td className="button-cell">
//                     {editingDetail && editingDetail.id === detail.id ? (
//                       <>
//                         <button className="action-button" onClick={handleSave}>Save</button>
//                         <button className="action-button" onClick={handleCancelEdit}>Cancel</button>
//                       </>
//                     ) : (
//                       <button className="action-button" onClick={() => handleEdit(detail)}><i className="fas fa-edit"></i></button>
//                     )}
//                     <button className="action-button" onClick={() => handleDelete(detail.id)}><i className="fas fa-trash-alt"></i></button>
//                     <button className="action-button" onClick={() => handleGeneratePDF(detail)}><i className="fa fa-download"></i></button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     )}
//   </div>
// );
// };
return (
  <div>
    <Grid />
    <SalesComparisonChart />
    <h2 style={{position:"relative",left:"20px"}}>Details By Date</h2>
    <DatePicker
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      dateFormat="dd/MM/yyyy"
      className="custom-date"
    />
    <button onClick={handleDownloadPDF} className="download-button">Download Today's Data</button>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="table-container">
        {details.length === 0 ? (
          <p>No details recorded on this date.</p>
        ) : (
          <table className="details-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Discount Amount</th>
                <th>CGST Amount</th>
                <th>SGST Amount</th>
                <th>IGST Amount</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {details.map(detail => (
                <tr key={detail.id}>
                  <td>
                    {editingDetail && editingDetail.id === detail.id ? (
                      <input
                        type="text"
                        value={editingDetail.customerName}
                        onChange={(e) => setEditingDetail({ ...editingDetail, customerName: e.target.value })}
                      />
                    ) : (
                      detail.customerName
                    )}
                  </td>
                  <td>₹{detail.discountedTotal ? detail.discountedTotal.toFixed(2) : 'N/A'}</td>
                  <td>₹{detail.cgstAmount ? detail.cgstAmount.toFixed(2) : 'N/A'}</td>
                  <td>₹{detail.sgstAmount ? detail.sgstAmount.toFixed(2) : 'N/A'}</td>
                  <td>₹{detail.igstAmount ? detail.igstAmount.toFixed(2) : 'N/A'}</td>
                  <td>
                    {editingDetail && editingDetail.id === detail.id ? (
                      <input
                        type="text"
                        value={editingDetail.totalAmount}
                        onChange={(e) => setEditingDetail({ ...editingDetail, totalAmount: e.target.value })}
                      />
                    ) : (
                      `₹${detail.totalAmount}`
                    )}
                  </td>
                  <td className="button-cell">
                    {editingDetail && editingDetail.id === detail.id ? (
                      <>
                        <button className="action-button" onClick={handleSave}>Save</button>
                        <button className="action-button" onClick={handleCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <button className="action-button" onClick={() => handleEdit(detail)}><i className="fas fa-edit"></i></button>
                    )}
                    <button className="action-button" onClick={() => handleDelete(detail.id)}><i className="fas fa-trash-alt"></i></button>
                    <button className="action-button" onClick={() => handleGeneratePDF(detail)}><i className="fa fa-download"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )}
  </div>
);
};
export default Homepage;
