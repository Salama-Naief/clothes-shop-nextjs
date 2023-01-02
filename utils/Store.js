import Cookies from "js-cookie";
import {createContext, useReducer} from "react"

const initailState={
    pages:[],
    user:Cookies.get("user")?JSON.parse(Cookies.get("user")):null,
    viewedCart:Cookies.get("viewedCart")?JSON.parse(Cookies.get("viewedCart")):[],
    cart:{
        cartItems:Cookies.get("items")?JSON.parse(Cookies.get("items")):[],
        shipping:Cookies.get("shipping")?JSON.parse(Cookies.get("shipping")):{},
        paymanetMethod:Cookies.get("paymentMethod")?Cookies.get("paymentMethod"):"",
        orderComplete:false
    }
}
export const Store= createContext();

function reducer(state,action){
  switch (action.type){
      case "ADD_TO_CART":{
        const newItem=action.payload;        
        const existItem=state.cart.cartItems.find(item=>item.slug===newItem.slug);
        const cartItems=existItem?state.cart.cartItems.map(item=>
          item.slug===existItem.slug?newItem:item
        ):[...state.cart.cartItems,newItem];
         Cookies.set("items",JSON.stringify(cartItems));
        return{...state,cart:{...state.cart,cartItems}}
      }
      case "REMOVE_FROM_CART":{
        const cartItems=state.cart.cartItems.filter(item=>item.slug!==action.payload.slug);
        Cookies.set("items",JSON.stringify(cartItems));
        return{...state,cart:{...state.cart,cartItems}}
      }
      case "ADD_SHIPPING":{
        Cookies.set("shipping",JSON.stringify(action.payload));
        return{...state,cart:{...state.cart,shipping:action.payload}}
      }
      case "ADD_PAYMENT_METHOD":{
        Cookies.set("paymentMethod",action.payload);
        return{...state,cart:{...state.cart,paymanetMethod:action.payload}}
      }
      case "CLEAR_CARITEMS":{
        return{...state,cart:{...state.cart,cartItems:[]}}
      }
      case "ORDER_COMPLEATE":{
        return{...state,cart:{...state.cart,orderComplete:true}}
      }
      case "USER_LOGIN":{
        Cookies.set("user",JSON.stringify(action.payload));
        return{...state,user:action.payload}
      }
      case "USER_LOGOUT":{
        Cookies.remove("user");
        Cookies.remove("cartIems");
        Cookies.remove("shipping");
        return{...state,user:null,cart:{cartItems:[]}}
      }
      case "ADD_VIEWED_CARD":{
        const newItem=action.payload;        
        const existItem=state.viewedCart.find(item=>item.slug===newItem.slug);
        const viewedCart=existItem?state.viewedCart.map(item=>
          item.slug===existItem.slug?newItem:item
        ):[...state.viewedCart,newItem];
         Cookies.set("viewedCart",JSON.stringify(viewedCart));
        return{...state,viewedCart}
      }
      case "ADD_PAGES":{
        return{...state,pages:action.payload}
      }
      default : return state;
  }
}


export default function StoreProvider(props){
    const [state,dispatch]=useReducer(reducer,initailState)
    const value={state,dispatch}

    return <Store.Provider value={value}>{props.children}</Store.Provider>
}