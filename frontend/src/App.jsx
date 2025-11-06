import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerLogin from "./pages/CustomerLogin";
import Payment from "./pages/CustomerPayment"; // import payment page

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CustomerRegister />} />
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/customer/payment" element={<Payment />} /> {/* new route */}
    </Routes>
  </BrowserRouter>
);

export default App;
