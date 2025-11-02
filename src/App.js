
import './App.css';

import React from 'react';
import { ShowPage } from './Pages/show';
import { ShowPageOM } from './Pages/showOM';
import { Explore } from './Pages/explore';
import { Manage } from './Pages/manage';

import { AuthProvider } from './context';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {

  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <nav>
            <div className="d-flex justify-content-center mt-5 transparent-border">
              <Link to="/STX" className="btn btn-primary me-2"><i className="bi bi-graph-up"></i> STX</Link>
              <span style={{ margin: '0 10px' }}></span>
              <Link to="/OM" className="btn btn-secondary"><i className="bi bi-toggles2"></i> OM1</Link>
              <span style={{ margin: '0 10px' }}></span>
              <Link to="/EXP" className="btn btn-success"><i className="bi bi-toggles2"></i>Explore</Link>
              <span style={{ margin: '0 10px' }}></span>
              <Link to="/MNG" className="btn btn-success"><i className="bi bi-toggles2"></i>Manage</Link>
            </div>
          </nav>
          <Routes>
            <Route path="/STX" element={<ShowPage />} />
            <Route path="/OM" element={<ShowPageOM />} />
            <Route path="/EXP/*" element={<Explore />} /> 
            <Route path="/MNG/*" element={<Manage />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
