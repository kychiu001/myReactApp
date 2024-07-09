// import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useState, useEffect, useContext} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";


import { ImageComponent } from '../Components/Form/imageComp';
import { AuthContext } from '../context'; // Import the context
import { mostMatchingString, fetchData } from '../searchUtils';

import { Book } from './book';

let newHost = `https://www.onemap.gov.sg`; // replace with your host
let baseUrl = `${newHost}/api/common/elastic/search`;

export const Explore = () => {
    
  const [loadedPosts, setLoadedPosts] = useState([]);
  const {token, setToken, userid, setUserid, om_userid, om_setUserid, om_token, om_setToken } = useContext(AuthContext);
  const [hotel_name, setHotelName] = useState(null);
  const [lat, setLat] = useState(null);   
  const [long, setLong] = useState(null);  
  const [pngdata, setPngdata] = useState(null); 

  const getToken = (user, a_token) => {
    debugger
    setUserid(user);
    setToken(a_token);
  };

  const getCoord = (coord) => {
    debugger
    setLat(coord.lat);
    setLong(coord.long);
    setHotelName(coord.hotelName);
  };


function handleClick(hotel_name) {

    let hotel_Name = hotel_name;
    
    alert(`You clicked on ${hotel_name}`);

    fetchData(baseUrl, hotel_name).then(queryResults => {
        console.log(queryResults); // Logs the query results to the console
        debugger
        console.log(queryResults.length);
        if (queryResults.length === 0) {
            let coord = {'lat': 0, 'long': 0, 'hotelName': null};
            getCoord(coord);
            return;
        }
        let queryResultNames = queryResults.map(result => result['SEARCHVAL']);
        let [mostMatch, index] = mostMatchingString(hotel_Name, queryResultNames);
        
        console.log(mostMatch);
        console.log(queryResults[index]);
        console.log(queryResults[index]['LATITUDE'], queryResults[index]['LONGITUDE']);
        
        let lat = queryResults[index]['LATITUDE'];
        let long = queryResults[index]['LONGITUDE'];
        // let coord = {'lat': lat, 'long': long, 'hotelName': mostMatch};
        let coord = {'lat': lat, 'long': long, 'hotelName': hotel_name};
        getCoord(coord)});
        
  }
  
  useEffect(function () {
 
    debugger
    if (token && !hotel_name) {
        const encodedCredentials = btoa(`${userid}:${token}`);
        // Create the headers object with the authorization header
        const headers = {
          Authorization: `Basic ${encodedCredentials}`,
        };

        // Send the POST request
        const url = process.env.REACT_APP_IP_ADDRESS ? `http://${process.env.REACT_APP_IP_ADDRESS}:5000` : 'http://localhost:5000'; // Replace with your actual API URL
        fetch(`${url}/api/package/getAllPackages`, {
            method: 'POST',
            headers: headers,
        }).then(response => response.json())
        .then(message => {
          console.log('API Response:', message);
              if (Array.isArray(message.data)) {
                  setLoadedPosts(message.data);
              } else {
                  console.error('Expected an array but got:', message.data);
                  setLoadedPosts([]);
              }
          })
          .catch(error => {
                console.error('Error fetching data:', error);
                setLoadedPosts([]);
            });
        }

    if (om_token && lat && long && hotel_name) {

        const encodedCredentials = btoa(`${om_userid}:${om_token}`);
        // Create the headers object with the authorization header
        
        const headers = {
            Authorization: `Basic ${encodedCredentials}`,
        };

        // Send the POST request
        const url = 'https://www.onemap.gov.sg/api/staticmap/getStaticImage?'; 
        // Shangari-La Singapore: 1.31122438238089 103.826788133417
        // const lat = 1.31122438238089; 
        // const long = 103.826788133417; 
        const query_string = `layerchosen=default&latitude=${lat}&longitude=${long}&points=[${lat},${long}]&postal=&zoom=17&width=400&height=512&fillColor=0,255,0`;

        fetch(`${url}${query_string}`, {
            method: 'GET',
            headers: headers,
        }).then(response => {
            debugger;
            console.log(response);
            return response.blob()
        }).then(message => {
            debugger
            setPngdata(message)})}
    },
    [token, userid, hotel_name, lat, long]);

  // debugger
  return (
    <>
        <div className="container">
            { 

            (!token || !om_token) && 
                <div className="warning">
                <p>Please get tokens from StaycationX and OneMap first.</p>
                </div>
            }

            { !hotel_name && token && om_token && loadedPosts && loadedPosts.length > 0 && (
              <div className="card-body text-center">
                <h1 className="display-4 mt-5 animate__animated animate__tada" style={{fontSize: '2rem'}}>Listing of All Packages</h1>
                <div className="banner">User ID: {userid}</div> {/* Add the banner here */}
                <div className="row mt-4 mb-4">
                    {loadedPosts.map((post) => (
                        <div key={post.id} className="col-md-4">
                            <div className="card mb-4">
                                <img src={post.image_url} className="card-img-top" alt="Post Image" />
                                <div className="card-body">
                                    <h5 className="card-title">{post.hotel_name}</h5>
                                    <p className="card-text">Description: {post.description}</p>
                                    <p className="card-text">Unit Cost: {post.unit_cost}</p>
                                    <p className="card-text">Duration: {post.duration}</p>
                                    <button className="btn btn-primary" onClick={() => handleClick(post.hotel_name)}>View Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="btn btn-primary" onClick={() => {setToken(null); om_setToken(null)}}>Logout</button> {/* Add the logout button here */}
              </div>

            )}

            { token && pngdata && hotel_name &&
                
                <div style={{ marginTop: '20px' }}>
                    <ImageComponent blob={pngdata} hotel={hotel_name}/>
                    <div style={{ marginTop: '20px' }}>
                        <Link to="/EXP" className="btn btn-success" onClick={() => {setPngdata(null);setHotelName(null);}}><i className="bi bi-toggles2"></i>Next</Link>
                        <Link to="/EXP/BOOK" className="btn btn-success"><i className="bi bi-toggles2"></i>Book</Link>
                        {/* <Link to={{ pathname: "/EXP/BOOK", state: { hotel_name: {hotel_name} }}}className="btn btn-success"><i className="bi bi-toggles2"></i>Book</Link> */}
                        <Routes>
                            <Route path="/BOOK" element={<Book hotel_name={hotel_name} set_hotel_name={setHotelName} />} /> 
                        </Routes>
                </div>
                <button className="btn btn-primary" onClick={() => {setToken(null); om_setToken(null)}}>Logout</button> {/* Add the logout button here */}
                </div>
                
            }   
                
        </div>
    </>
  );
}