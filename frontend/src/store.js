import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
    productListReducer,
    productDetailsReducer
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import { mainAlertReducer } from './reducers/mainAlertReducers';
import {
    userDetailsReducer,
    userLoginReducer,
    userRegisterReducer,
    userUpdateProfileReducer
} from './reducers/userReducers';
import {
    cancelMyOrderReducer,
    orderCreatesReducers,
    orderDetailsReducers,
    orderListMineReducer,
} from './reducers/orderReducers';
import { wishlistReducer } from './reducers/wishlistReducers';


const reducers = combineReducers({
    mainAlert: mainAlertReducer,
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    orderCreate: orderCreatesReducers,
    orderDetails: orderDetailsReducers,
    orderListMine: orderListMineReducer,
    wishlist: wishlistReducer,
    cancelMyOrder: cancelMyOrderReducer,
});


const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
    ? localStorage.getItem('paymentMethod')
    : '';

const initialState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage,
        paymentMethod: paymentMethodFromStorage
    },
    userLogin: { userInfo: userInfoFromStorage }
};

const middleware = [thunk];

const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;