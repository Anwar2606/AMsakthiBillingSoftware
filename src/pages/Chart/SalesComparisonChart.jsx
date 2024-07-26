// // SalesComparisonChart.js

// import React, { useEffect, useState } from "react";
// import { db } from "../firebase"; // Adjust the path to your firebase.js
// import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import "./SalesComparisonChart.css"; // Adjust path to your CSS file

// const SalesComparisonChart = () => {
//   const [salesData, setSalesData] = useState([]);

//   useEffect(() => {
//     const fetchSalesData = async () => {
//       const today = new Date();
//       const yesterday = new Date(today);
//       yesterday.setDate(today.getDate() - 1);

//       const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
//       const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

//       const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
//       const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);

//       const todaySalesQuery = query(
//         collection(db, "billing"),
//         where("date", ">=", startOfToday),
//         where("date", "<=", endOfToday)
//       );

//       const yesterdaySalesQuery = query(
//         collection(db, "billing"),
//         where("date", ">=", startOfYesterday),
//         where("date", "<=", endOfYesterday)
//       );

//       try {
//         const todaySalesSnapshot = await getDocs(todaySalesQuery);
//         const yesterdaySalesSnapshot = await getDocs(yesterdaySalesQuery);

//         const todaySalesTotal = calculateTotalAmount(todaySalesSnapshot);
//         const yesterdaySalesTotal = calculateTotalAmount(yesterdaySalesSnapshot);

//         setSalesData([
//           { name: "Today", Sales: todaySalesTotal },
//           { name: "Yesterday", Sales: yesterdaySalesTotal }
//         ]);
//       } catch (error) {
//         console.error("Error fetching sales data: ", error);
//       }
//     };

//     fetchSalesData();
//   }, []);

//   const calculateTotalAmount = (snapshot) => {
//     return snapshot.docs.reduce((total, doc) => total + doc.data().totalAmount, 0);
//   };

//   return (
//     <div className="chart-container">
//       <h1 className="chart-header">Sales Comparison</h1>
//       <ResponsiveContainer width="60%" height={400}>
//         <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="Sales" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default SalesComparisonChart;
// SalesComparisonChart.js

// import React, { useEffect, useState } from "react";
// import { db } from "../firebase"; // Adjust the path to your firebase.js
// import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import "./SalesComparisonChart.css"; // Adjust path to your CSS file

// const SalesComparisonChart = () => {
//   const [salesData, setSalesData] = useState([]);

//   useEffect(() => {
//     const fetchSalesData = async () => {
//       const today = new Date();
//       const yesterday = new Date(today);
//       yesterday.setDate(today.getDate() - 1);

//       const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
//       const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

//       const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
//       const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);

//       const todaySalesQuery = query(
//         collection(db, "billing"),
//         where("date", ">=", startOfToday),
//         where("date", "<=", endOfToday)
//       );

//       const yesterdaySalesQuery = query(
//         collection(db, "billing"),
//         where("date", ">=", startOfYesterday),
//         where("date", "<=", endOfYesterday)
//       );

//       try {
//         const todaySalesSnapshot = await getDocs(todaySalesQuery);
//         const yesterdaySalesSnapshot = await getDocs(yesterdaySalesQuery);

//         const todaySalesTotal = calculateTotalAmount(todaySalesSnapshot);
//         const yesterdaySalesTotal = calculateTotalAmount(yesterdaySalesSnapshot);

//         setSalesData([
//           { name: "Today", Sales: todaySalesTotal },
//           { name: "Yesterday", Sales: yesterdaySalesTotal }
//         ]);
//       } catch (error) {
//         console.error("Error fetching sales data: ", error);
//       }
//     };

//     fetchSalesData();
//   }, []);

//   const calculateTotalAmount = (snapshot) => {
//     return snapshot.docs.reduce((total, doc) => total + doc.data().totalAmount, 0);
//   };

//   return (
//     <div className="chart-container">
//       <h1 className="chart-header">Sales Comparison</h1>
//       <ResponsiveContainer width="60%" height={400}>
//         <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="Sales" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default SalesComparisonChart;
// SalesComparisonChart.js

import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Adjust the path to your firebase.js
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./SalesComparisonChart.css"; // Adjust path to your CSS file

const SalesComparisonChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

      const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0);
      const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);

      const todaySalesQuery = query(
        collection(db, "billing"),
        where("date", ">=", startOfToday),
        where("date", "<=", endOfToday)
      );

      const yesterdaySalesQuery = query(
        collection(db, "billing"),
        where("date", ">=", startOfYesterday),
        where("date", "<=", endOfYesterday)
      );

      try {
        const todaySalesSnapshot = await getDocs(todaySalesQuery);
        const yesterdaySalesSnapshot = await getDocs(yesterdaySalesQuery);

        const todaySalesTotal = calculateTotalAmount(todaySalesSnapshot);
        const yesterdaySalesTotal = calculateTotalAmount(yesterdaySalesSnapshot);

        setSalesData([
          { name: "Today", Sales: todaySalesTotal },
          { name: "Yesterday", Sales: yesterdaySalesTotal }
        ]);
      } catch (error) {
        console.error("Error fetching sales data: ", error);
      }
    };

    fetchSalesData();
  }, []);

  const calculateTotalAmount = (snapshot) => {
    return snapshot.docs.reduce((total, doc) => total + doc.data().totalAmount, 0);
  };

  return (
    <div className="chart-container">
      <h1 className="chart-header">Sales Comparison</h1>
      <ResponsiveContainer width="60%" height={400}>
        <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Sales" fill="url(#colorSales)" animationDuration={1500} />
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesComparisonChart;
