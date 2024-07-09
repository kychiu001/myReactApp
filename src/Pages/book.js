// This modulue mainly performs the create booking function
// import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useState, useEffect, useContext} from 'react';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
  } from "react-router-dom";

import { AuthContext } from '../context'; // Import the context

export const Book = ({hotel_name, set_hotel_name}) => {
    
  const {token, setToken, userid, setUserid, om_userid, om_setUserid, om_token, om_setToken } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = () => {
    // Call the create booking function with selectedDate
    debugger
    createBooking(selectedDate);
    setSelectedDate('');
    set_hotel_name(null);
    navigate('/EXP')
  };

  const createBooking = (date) => {
    // Implement your create booking logic here
    console.log(`Creating booking for ${date}`);
    
    debugger
    const encodedCredentials = btoa(`${userid}:${token}`);
    const headers = {
      Authorization: `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    
    // Call the API to create a new booking
    const url = process.env.REACT_APP_IP_ADDRESS ? `http://${process.env.REACT_APP_IP_ADDRESS}:5000` : 'http://localhost:5000';
    fetch(`${url}/api/book/newBooking`, {
        method: 'POST',
        headers: headers,
        body: new URLSearchParams({
            user_email: userid,
            hotel_name: hotel_name,
            check_in_date: selectedDate
          })
    })
    .then(response => {
        if (response.status === 201) {
            return response.json();
        } else {
            return response.json().then(data => {
                throw new Error(data.message);
            });
        }
    })
    .then(data => {
        // Handle the response from the API
        console.log(data);
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
    });
      };

  return (
    <>
      <form>
        <label htmlFor="date"  style={{ marginTop: '20px' }}>Select a date:</label>
        <input type="date" id="date" value={selectedDate} onChange={handleDateChange} />
        <button type="button" onClick={handleSubmit}>Submit</button>
      </form>
    </>
  );
};

export default Book;