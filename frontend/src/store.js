import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
    productListReducer,
    productDetailsReducer,
    productDeleteReducer,
    productCreateReducer,
    productUpdateReducer,
    productReviewReducer,
    productListAdminReducer,
    productTopRattedReducer
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import { mainAlertReducer } from './reducers/mainAlertReducers';
import {
    googleLoginReducer,
    googleRegisterReducer,
    userDeleteReducer,
    userDetailsReducer,
    userListReducer,
    userLoginReducer,
    userRegisterReducer,
    userUpdateProfileReducer,
    userUpdateReducer
} from './reducers/userReducers';
import {
    cancelMyOrderReducer,
    deliverOrderReducer,
    orderCreatesReducers,
    orderDetailsReducers,
    orderListMineReducer,
    orderListReducer,
} from './reducers/orderReducers';
import {
    brandListReducer,
    brandOfferCreateReducer,
    brandOfferDeleteReducer
} from './reducers/bransReducers';
import { couponCreateReducer, couponDeleteReducer, couponListReducer } from './reducers/couponReducers';
import { salesListReducer } from './reducers/salesReducers';
import { wishlistReducer } from './reducers/wishlistReducers';
import { dasboardReducer } from './reducers/dashboardReducers';


const reducers = combineReducers({
    mainAlert: mainAlertReducer,
    productList: productListReducer,
    productTopRatted: productTopRattedReducer,
    productListAdmin: productListAdminReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReview: productReviewReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    googleLogin: googleLoginReducer,
    googleRegister: googleRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    orderCreate: orderCreatesReducers,
    orderDetails: orderDetailsReducers,
    orderListMine: orderListMineReducer,
    cancelMyOrder: cancelMyOrderReducer,
    deliverOrder: deliverOrderReducer,
    orderList: orderListReducer,
    salesList: salesListReducer,
    wishlist: wishlistReducer,
    brandList: brandListReducer,
    brandOfferCreate: brandOfferCreateReducer,
    brandOfferDelete: brandOfferDeleteReducer,
    couponList: couponListReducer,
    couponCreate: couponCreateReducer,
    couponDelete: couponDeleteReducer,
    dashboard: dasboardReducer
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
    process.env.NODE_ENV === 'development'
        ? composeWithDevTools(applyMiddleware(...middleware))
        : applyMiddleware(...middleware)
);

export default store;