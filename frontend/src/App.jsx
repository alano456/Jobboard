import { useState, useEffect } from 'react';
import api from './api';
import { AppliedOffer } from './components/AppliedOffer';
import { Offer } from './components/Offer';
import { CreateAccount } from './components/CreateAcoount';
import { Register } from '../pages/Register';
import { BasicInformation } from './components/EmployerAccountSetUp';
import { RegisterContinue } from '../pages/RegisterContinue';



function App() {

  return (
    <>
      <RegisterContinue />
    </>
  )
}

export default App
