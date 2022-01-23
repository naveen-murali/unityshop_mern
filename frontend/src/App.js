import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

// action 
import { varifyuser } from './actions/userActions';

// components
import Header from './components/Header';
import Footer from './components/Footer';
import MainAlert from './components/MainAlert';

// screens
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ForgotPassword from './screens/ForgotPassword';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import WhishlistScreen from './screens/WhishlistScreen';
import ErrorScreen from './screens/ErrorScreen';

function App() {
  const { mainAlert, userLogin: { userInfo } } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo)
      dispatch(varifyuser());
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <BrowserRouter>
      {/* <div className="container-fluid"> */}

      <Header />
      <main className='py-3'>
        <Container>

          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeOrder" element={<PlaceOrderScreen />} />
            <Route path="/myOrders" element={<MyOrdersScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />

            <Route path="/profile" element={userInfo ? <ProfileScreen /> : <Navigate to='/login' />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart">
              <Route path="" element={<CartScreen />} />
              <Route path=":id" element={<CartScreen />} />
            </Route>
            <Route path="/wishlist">
              <Route path="" element={<WhishlistScreen />} />
            </Route>
            <Route path="/" element={<HomeScreen />} />
            <Route path="*" element={<ErrorScreen />} />
          </Routes>

        </Container>
      </main>
      <Footer />

      {mainAlert.message && <MainAlert {...mainAlert} />}
      {/* </div> */}
    </BrowserRouter >
  );
}

export default App;
