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

export default function Order({ order, pages, errMsg }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [errMessage, setErrMessage] = useState("");
  const [pay, setPay] = useState(true);

  const handlePayment = async () => {
    const orderData = order?.attributes.products?.data.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          images: item.attributes.productImg.data.map(
            (img) => API_URL + img.attributes.url
          ),
          name: item.attributes.name,
          description: item.attributes.description,
        },
        unit_amount: item.attributes.price * 100,
      },
      quantity: 1,
    }));

    const { data } = await axios.post("/api/checkout_sessions", {
      items: orderData,
      orderId: order.id,
    });

    const stripe = await getStripe();
    stripe.redirectToCheckout({ sessionId: data.id });
  };

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
                    <span className="text-error capitalize">
                      {t("placeorder:not_payed_yet")}
                    </span>
                  </div>
                </div>
              </div>
              <table className="table-auto text-left w-full shadow my-4 px-4">
                <thead className="border-b border-gray-400">
                  <tr className="">
                    <th className="py-4 text-center">{t("placeorder:name")}</th>
                    <th>{t("placeorder:color")}</th>
                    <th>{t("placeorder:size")}</th>
                    <th>{t("placeorder:price")}</th>
                    <th>{t("placeorder:offer")}</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.attributes.products?.data.map((item) => (
                    <tr key={item.id} className="border-b border-gray-400">
                      <td className="py-2">
                        <Link href={`/product/${"item.slug"}`}>
                          <a>
                            <div className="flex items-center">
                              <div className="w-1/3 h-24 overflow-hidden relative bg-gray-100">
                                <Image
                                  src={
                                    item.attributes.productImg.data[0]
                                      .attributes.formats.thumbnail.url
                                  }
                                  layout="fill"
                                  loading="eager"
                                  alt={item.attributes.name}
                                  objectFit="contain"
                                  objectPosition="center"
                                />
                              </div>
                              <div className="mx-2 capitalize">
                                {item.attributes.name}
                              </div>
                            </div>
                          </a>
                        </Link>
                      </td>
                      <td>{item.attributes.color}</td>
                      <td>{item.attributes.size}</td>
                      <td
                        className={`${
                          item.attributes.offer > 0
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        } `}
                      >
                        ${item.attributes.price}
                      </td>
                      {item.attributes.offer > 0 && (
                        <td className="text-secondary">
                          ${item.attributes.offer ? item.attributes.offer : 0}
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
                  ({order.attributes.numOfItems}){t("placeorder:items")}
                </div>
              </div>
              <div className="flex justify-between my-4">
                <div className="font-semibold">{t("placeorder:price")}</div>
                <div className="">${order.attributes.price}</div>
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
                <div className="text-secondary">
                  ${order.attributes.totalPrice}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handlePayment()}
                  className="w-full bg-primary text-white uppercase my-4 py-2"
                >
                  {t("placeorder:pay")}
                </button>
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            value: "1.99",
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                      const name = details.payer.name.given_name;
                      alert(`Transaction completed by ${name}`);
                    });
                  }}
                />
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

export async function getStaticPaths({ locales }) {
  const res = await fetch(`${API_URL}/api/orders`);
  const data = await res.json();

  const paths = [];
  data.data.map((order) => {
    locales.map((locale) => {
      paths.push({ params: { id: `${order.id}` }, locale });
    });
  });

  return {
    paths,
    fallback: false,
  };
}
export async function getStaticProps(ctx) {
  const { id } = ctx.params;
  console.group("id", id);
  const locale = ctx.locale;
  try {
    const res = await fetch(
      `${API_URL}/api/orders/${parseInt(id)}?populate[products][populate]=*`
    );
    const order = await res.json();
    const pagesRes = await fetch(`${API_URL}/api/pages?populate=*`);
    const pages = await pagesRes.json();

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
