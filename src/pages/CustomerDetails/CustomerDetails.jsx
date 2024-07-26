// src/CustomerDetails.js
import React, { useState } from 'react';
import { db } from '../firebase'; // Import the initialized firebase instance
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CustomerDetails = () => {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      await addDoc(collection(db, 'customers'), {
        customerName,
        address,
        city,
        country,
        phoneNumber,
        email
      });
      console.log('Customer details saved successfully in Firestore');
      navigate('/');
    } catch (error) {
      console.error('Error saving customer details: ', error);
    }
  };

  return (
    <div>
      <h2>Enter Customer Details</h2>
      <form>
        <label>Customer Name:</label>
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <label>Address:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        <label>City:</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        <label>Country:</label>
        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
        <label>Phone Number:</label>
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="button" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
};

export default CustomerDetails;
