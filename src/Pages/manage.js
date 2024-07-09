// import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useState, useEffect, useContext} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";

import { AuthContext } from '../context'; // Import the context

function convertDateString(dateString) {
    // Step 1: Parse the input date string
    const date = new Date(dateString);
  
    // Step 2: Extract components from the Date object
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
    // Step 3: Format components into the desired string format
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }

export const Manage = () => {
    
  const [loadedBookings, setLoadedBookings] = useState([]);
  const {token, setToken, userid, setUserid, om_userid, om_setUserid, om_token, om_setToken } = useContext(AuthContext);


    function handleUpdate(hotel_name, in_old_check_in_date, in_new_check_in_date) {

        debugger
        // let hotel_name = hotel_name;    
        // let old_check_in_date = old_check_in_date;      
        // let new_check_in_date = new_check_in_date; 
        alert(`You clicked on ${hotel_name}`);
        let old_check_in_date = convertDateString(in_old_check_in_date);
        // let new_check_in_date = convertDateString(in_new_check_in_date);
        let new_check_in_date = in_new_check_in_date;

        const encodedCredentials = btoa(`${userid}:${token}`);
        // Create the headers object with the authorization header
        const headers = {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        // Send the POST request
        const url = 'http://localhost:5000'; // Replace with your actual API URL
        fetch(`${url}/api/book/updateBooking`, {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams({
                user_email: userid,
                hotel_name: hotel_name,
                old_check_in_date: old_check_in_date,
                new_check_in_date: new_check_in_date
              })
        }).then(response => {
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
        })
    
        setLoadedBookings([]);
    }

  
    function handleDelete(hotel_name, in_check_in_date) {

        // let hotel_name = hotel_name;    
        // let check_in_date = check_in_date;       
        alert(`You clicked on ${hotel_name}`);

        let check_in_date = convertDateString(in_check_in_date);

        const encodedCredentials = btoa(`${userid}:${token}`);
        // Create the headers object with the authorization header
        const headers = {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        // Send the POST request
        const url = 'http://localhost:5000'; // Replace with your actual API URL
        fetch(`${url}/api/book/deleteBooking`, {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams({
                user_email: userid,
                hotel_name: hotel_name,
                check_in_date: check_in_date
              })
        }).then(response => {
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
        })
    
        debugger
        setLoadedBookings([]);
    }

  
  useEffect(function () {
 
    debugger
    if (token && loadedBookings.length === 0) {
        const encodedCredentials = btoa(`${userid}:${token}`);
        // Create the headers object with the authorization header
        const headers = {
            Authorization: `Basic ${encodedCredentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        // Send the POST request
        const url = process.env.REACT_APP_IP_ADDRESS ? `http://${process.env.REACT_APP_IP_ADDRESS}:5000` : 'http://localhost:5000'; // Replace with your actual API URL
        fetch(`${url}/api/book/manageBooking`, {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams({
                user_email: userid,
              })
        }).then(response => response.json())
        .then(message => {
          console.log('API Response:', message);
              if (Array.isArray(message.data)) {
                  setLoadedBookings(message.data);
              } else {
                  console.error('Expected an array but got:', message.data);
                  setLoadedBookings([]);
              }
          })
          .catch(error => {
                console.error('Error fetching data:', error);
                setLoadedBookings([]);
            });
        }
    },
    [token, userid, loadedBookings]);

  // debugger
  return (
    <>
        <div className="container">
            { 

            !token && 
                <div className="warning">
                <p>Please get tokens from StaycationX and OneMap first.</p>
                </div>
            }

            { token && loadedBookings.length > 0 && (
            <div className="card-body text-center">
                <h1 className="display-4 mt-5 animate__animated animate__tada" style={{fontSize: '2rem'}}>Listing of All Bookings</h1>
                <div className="banner">User ID: {userid}</div> {/* Add the banner here */}
                <div className="row mt-4 mb-4">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Package</th>
                                <th>Check-in Date</th>
                                <th>Change to Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadedBookings.map((post, index) => (
                                <tr key={post.id}>
                                    <td>{post.package}</td>
                                    <td>{post.check_in_date}</td>
                                    <td>
                                        <input type="date" id={`new_date_${index}`} />
                                    </td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleDelete(post.package, post.check_in_date)}>Delete</button>
                                        <button className="btn btn-primary" onClick={() => handleUpdate(post.package, post.check_in_date, document.getElementById(`new_date_${index}`).value)}>Update</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="btn btn-primary" onClick={() => {setToken(null); om_setToken(null)}}>Logout</button> {/* Add the logout button here */}
            </div>

            )}
                
        </div>
    </>
  );
}