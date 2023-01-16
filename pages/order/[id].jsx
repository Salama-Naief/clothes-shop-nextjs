import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { PayPalButtons } from "@paypal/react-paypal-js";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Stipper from "../../components/payments/Stipper";
import { API_URL } from "../../utils/connectionConfig";
import ReactDOM from "react-dom";
import getStripe from "../../lib/get-stripe";
import { Store } from "../../utils/Store";

export default function Order({ order, pages, errMsg }) {
  const router = useRouter();
  const { state } = useContext(Store);
  const { t } = useTranslation();
  const [errMessage, setErrMessage] = useState("");
  const [pay, setPay] = useState(true);
  //number of items
  const numItems = order?.attributes.orderProducts?.data.reduce(
    (a, c) => a + c.attributes.quantity,
    0
  );
  //products price
  const productsPrice = order?.attributes.orderProducts?.data.reduce(
    (sum, item) => {
      const quantity = parseInt(item.attributes.quantity);

      const price =
        item.attributes.product.data.attributes.offer > 0
          ? item.attributes.product.data.attributes.offer * quantity
          : item.attributes.product.data.attributes.price * quantity;
      return sum + parseFloat(price);
    },
    0
  );
  // total price of products price and tax cost and shipping cost
  console.log(
    "shippingCost",
    order?.attributes.shippingCost,
    order?.attributes.texCost
  );
  const totalCost =
    parseFloat(productsPrice) +
    parseFloat(order?.attributes.shippingCost) +
    parseFloat(order?.attributes.texCost);
  //stripeepayments
  const handlePayment = async () => {
    const s =
      order?.attributes.orderProducts?.data[0].attributes.product.data.attributes.productImg.data.map(
        (img) => img.attributes.url
      );
    console.log("imag url", s);
    const orderData = order?.attributes.orderProducts?.data.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          images: item.attributes.product.data.attributes.productImg.data.map(
            (img) => img.attributes.url
          ),
          name: item.attributes.product.data.attributes.name,
          description: item.attributes.product.data.attributes.description,
        },
        unit_amount:
          item.attributes.product.data.attributes.offer > 0
            ? item.attributes.product.data.attributes.offer * 100
            : item.attributes.product.data.attributes.price * 100,
      },
      quantity: item.attributes.quantity,
    }));

    const { data } = await axios.post("/api/checkout_sessions", {
      items: orderData,
      orderId: order.id,
    });

    const stripe = await getStripe();
    stripe.redirectToCheckout({ sessionId: data.id });
  };

  //paypal payments create oreder function
  const createPayPalOrder = async () => {
    const response = await axios.post("/api/paypal/createOrder", {
      orderId: order.id,
    });
    console.log("response", response);
    return response.data.orderID;
  };
  //paypal payments on approve function
  const onApprove = async (data) => {
    console.log("response data", data);
    const res = await axios.post("/api/paypal/captureOrder", data);
    try{
      const order={
        data:{
          isPayed:true,
      payedAt:new Date()
        }
      }
      const res = await fetch(`${API_URL}/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          authorization: `Bearer ${state.user.jwt}`,
        },
        body: JSON.stringify(order),
      });

      const orderData = await res.json();
    
    console.log("order updated Data",orderData)
  }catch(e){
    console.log(e)
  }
    return res;
  };

 
    
  console.log("orderProducts?.data", order);
  return (
    <Layout title={"order page"} pages={pages}>
  
      {errMsg ? (
        <div className="w-full h-full flex justify-center items-center text-xl text-error">
          {t("common:beckend_error")}
        </div>
      ) : (
        <div className="container mx-auto px-2 my-10">
          <div className="w-full ">
            <Stipper />
          </div>
          <h1 className="text-2xl md:text-3xl my-4 font-bold w-full text-center">
            {t("placeorder:order")}
          </h1>

          <div className="grid md:grid-cols-4">
            <div className="md:col-span-3">
              <div className="text-2xl font-semibold">
                {t("placeorder:order")}:{order.id}
              </div>
              <div className="shadow my-4 px-4">
                <h1 className="text-2xl">{t("placeorder:shipping_data")}</h1>
                <div className="py-4 flex">
                  <span className="mx-2">
                    {order.attributes.shippingData.fullname},
                  </span>
                  <span className="mx-2">
                    {order.attributes.shippingData.address},
                  </span>
                  <span className="mx-2">
                    {order.attributes.shippingData.city},
                  </span>
                  <span className="mx-2">
                    {order.attributes.shippingData.postalCode},
                  </span>
                  <span className="mx-2">
                    {order.attributes.shippingData.countary}
                  </span>
                </div>
                <div className="py-2 text-sm">
                  {t("placeorder:status")}:
                  <span className="text-error capitalize">
                    {t("placeorder:not_delevers_yet")}
                  </span>
                </div>
                <div className="py-2 text-sm">
                  {t("placeorder:orderedAt")}:
                  <span className=" capitalize">1/2/2023</span>
                </div>
              </div>
              <div className="shadow my-4 px-4">
                <h1 className="text-2xl capitalize">
                  {t("placeorder:payment_method")}
                </h1>
                <div className="py-4">
                  <span className="mx-2 capitalize font-semibold">
                    {order.attributes.paymentMethod}
                  </span>
                  <div className="my-4 text-sm">
                    {t("placeorder:status")}:
                    {
                      order.attributes.isPayed? 
                      <span className="text-green-500">payed</span>
                      :
                    <span className="text-error capitalize">
                      {t("placeorder:not_payed_yet")}
                    </span>
                    }
                  </div>
                </div>
              </div>
              <table className="table-auto text-left w-full shadow my-4 px-4">
                <thead className="border-b border-gray-400">
                  <tr className="">
                    <th className="py-4 text-center"></th>
                    <th className="py-4 text-center">{t("placeorder:name")}</th>
                    <th>{t("placeorder:quantity")}</th>
                    <th className="hidden md:table-cell">{t("placeorder:color")}</th>
                    <th className="hidden md:table-cell">{t("placeorder:size")}</th>
                    <th className="hidden md:table-cell">{t("placeorder:price")}</th>
                    <th className="hidden md:table-cell">{t("placeorder:offer")}</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.attributes.orderProducts?.data?.map((item) => (
                    <tr key={item.id} className="border-b border-gray-400">
                      <td className="py-2">
                            <div className="flex items-center">
                              <div className="w-24 h-24 overflow-hidden relative bg-gray-100">
                                <Image
                                  src={
                                    item.attributes.product.data.attributes
                                      .productImg.data[0].attributes.formats
                                      .thumbnail.url
                                  }
                                  layout="fill"
                                  loading="eager"
                                  alt={item.attributes.name}
                                  objectFit="contain"
                                  objectPosition="center"
                                />
                              </div>
                            </div>
                      </td>
                      <td className="mx-2 capitalize">
                        <Link href={`/product/${item.attributes.slug}`}>
                        <a>
                                {item.attributes.name}
                          </a>
                          </Link>
                      </td>
                      <td>{item.attributes.quantity}</td>
                      <td className="hidden md:table-cell">{item.attributes.product.data.attributes.color}</td>
                      <td className="hidden md:table-cell">{item.attributes.product.data.attributes.size}</td>
                      <td
                        className={`${
                          item.attributes.product.data.attributes.offer > 0
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        } hidden md:table-cell`}
                      >
                        ${item.attributes.product.data.attributes.price}
                      </td>
                      {item.attributes.product.data.attributes.offer > 0 && (
                        <td className="text-secondary hidden md:table-cell">
                          $
                          {item.attributes.product.data.attributes.offer
                            ? item.attributes.product.data.attributes.offer
                            : 0}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:col-span-1 shadow-md  px-4 mx-4">
              <div className="flex justify-between my-4">
                <div className="font-semibold">{t("placeorder:items")}</div>
                <div className="">
                  ({numItems}){t("placeorder:items")}
                </div>
              </div>
              <div className="flex justify-between my-4">
                <div className="font-semibold">{t("placeorder:price")}</div>
                <div className="">${productsPrice}</div>
              </div>
              <div className="flex justify-between my-4">
                <div className="font-semibold">{t("placeorder:tax")}</div>
                <div className="">${order.attributes.texCost}</div>
              </div>
              <div className="flex justify-between my-4">
                <div className="font-semibold">{t("placeorder:shipping")}</div>
                <div className="">${order.attributes.shippingCost}</div>
              </div>
              <div className="flex justify-between my-4">
                <div className="font-semibold">
                  {t("placeorder:total_cost")}
                </div>
                <div className="text-secondary">${totalCost}</div>
              </div>

              <div>
                {order.attributes.paymentMethod==="stripe"?
                <button
                onClick={() => handlePayment()}
                className="w-full bg-primary text-white uppercase my-4 py-2"
                >
                  {t("placeorder:pay")}
                </button>
                  :order.attributes.paymentMethod==="paypal"?
                <PayPalButtons
                createOrder={createPayPalOrder}
                onApprove={onApprove}
                />
                :null
                
              }
                <Link href={`/payment`} passHref>
                  <a>
                    <div className="w-full text-center bg-gray-50 text-gray-900 uppercase  py-2 border border-secondary">
                      {t("placeorder:back")}
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

/*export async function getStaticPaths({ locales }) {
  const res = await fetch(`${API_URL}/api/orders`);
  const orders = await res.json();

  const paths = [];
  if (orders?.data?.length > 0) {
    orders.data.map((order) => {
      locales.map((locale) => {
        paths.push({ params: { id: `${order.id}` }, locale });
      });
    });
  } else {
    paths.push({ params: { id: `` } });
  }
  return {
    paths,
    fallback: true,
  };
}*/
export async function getServerSideProps(ctx) {
  const locale = ctx.locale;
  try {
    const id = ctx.params?.id;
    const res = await fetch(
      `${API_URL}/api/orders/${id}?populate[orderProducts][populate][product][populate]=*`
    );
    const order = await res.json();
    const pagesRes = await fetch(
      `${API_URL}/api/pages?locale=${locale}&populate=*`
    );
    const pages = await pagesRes.json();
    console.log("order", order.data);
    return {
      props: {
        order: order.data,
        pages: pages.data || [],
        errMsg: false,
        ...(await serverSideTranslations(locale, ["common", "placeorder"])),
      },
    };
  } catch (err) {
    return {
      props: {
        errMsg: true,
        ...(await serverSideTranslations(locale, ["common", "placeorder"])),
      },
    };
  }
}
