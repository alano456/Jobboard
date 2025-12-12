import { useState, useEffect } from 'react';
import api from './api';
import { AppliedOffer } from './components/AppliedOffer';
import { Offer } from './components/Offer';
import { CreateAccount } from './components/CreateAcoount';
import { Register } from '../pages/Register';
import { DashboardEmployer } from '../pages/DashboardEmployer';
import { BasicInformation } from './components/EmployerAccountSetUp';
import { RegisterContinue, RegisterUserContinue, RegisterSetupWrapper } from '../pages/RegisterContinue';
import { EmployerSidebar } from './components/Sidebar';
import { NavbarEmployer } from './components/Navbar';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { DashboardUser } from '../pages/DashboardUser';



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/empl-dashboard" element={<DashboardEmployer />} />
          <Route path="/us-dashboard" element={<DashboardUser />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/signup/setup" element={<RegisterSetupWrapper />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
