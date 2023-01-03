import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import shortid from "shortid";
import Layout from "../components/Layout";
import Stipper from "../components/payments/Stipper";
import { API_URL } from "../utils/connectionConfig";
import { Store } from "../utils/Store";

export default function Placeorder({ pages }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const {
    user,
    cart: { cartItems, shipping, paymanetMethod },
  } = state;
  const { t } = useTranslation();
  const round = (c) => Math.round(c);
  const price = cartItems
    ? round(
        cartItems.reduce(
          (a, c) => a + c.quantity * (c.offer ? c.offer : c.price),
          0
        )
      )
    : 0;
  const numItems = cartItems
    ? cartItems.reduce((a, c) => a + c.quantity, 0)
    : 0;
  const shippingCost = price >= 100 ? 0 : round(price * (20 / 100));
  const taxCost = round(price * (20 / 100));
  const totalCost =
    parseInt(price) + parseInt(shippingCost) + parseInt(taxCost);
  const [cartData, setCartData] = useState([]);
  const [errMessage, setErrMessage] = useState("");
  useEffect(() => {
    if (!shipping) {
      router.push("/shipping");
    }

    const cartItemsData = cartItems?.map((item) => ({
      product: {
        name: item.name,
        id: item.id,
        image: item.productImg.data[0].attributes.formats.thumbnail.url,
        price: item.price,
        offer: item.offer,
        slug: item.slug,
        color: item.color,
        size: item.size,
      },
    }));
    setCartData(cartItemsData);
  }, [shipping, cartItems]);

  const handleOrder = async () => {
    const productsIds = cartData.map((item) => item.product.id);
    console.log("productsIds", productsIds);
    if (state.user && cartData.length > 0) {
      const order = {
        data: {
          shippingData: shipping,
          paymentMethod: paymanetMethod,
          price: price,
          shippingCost: shippingCost,
          texCost: taxCost,
          totalPrice: totalCost,
          numOfItems: numItems,
          isPayed: false,
          deleverd: false,
          payedAt: null,
          deleverdAt: null,
          user: user.user.id,
          products: productsIds,
        },
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
          authorization: `Bearer ${state.user.jwt}`,
        },
        body: JSON.stringify(order),
      });

      const orderData = await res.json();
      console.log("order data", orderData);
      console.log("user", state.user);
      if (orderData.error) {
        setErrMessage(orderData.error.message);
      }
      if (orderData.data) {
        router.push(`/order/${orderData.data.id}`);
        setErrMessage("");
        dispatch({ type: "CLEAR_CARITEMS" });
        dispatch({ type: "ORDER_COMPLEATE" });
      }
    } else {
      router.push("/login?redirect=/placeorder");
    }
  };
  return (
    <Layout title={"placeholder"} pages={pages}>
      <div className="container mx-auto px-2 my-10">
        <div className="w-full ">
          <Stipper />
        </div>
        <h1 className="text-2xl md:text-3xl my-4 font-bold w-full text-center">
          {t("placeorder:placeorder")}
        </h1>

        <div className="grid md:grid-cols-4">
          <div className="md:col-span-3">
            <div className="shadow my-4 px-4">
              <h1 className="text-2xl">{t("placeorder:shipping_data")}</h1>
              <div className="py-4 flex">
                <span className="mx-2">{shipping.fullname}</span>
                <span className="mx-2">{shipping.address}/</span>
                <span className="mx-2">{shipping.city}/</span>
                <span className="mx-2">{shipping.countary}/</span>
                <span className="mx-2">{shipping.postalCode}</span>
              </div>
            </div>
            <div className="shadow my-4 px-4">
              <h1 className="text-2xl capitalize">
                {t("placeorder:payment_method")}
              </h1>
              <div className="py-4 flex">
                <span className="mx-2 capitalize">{paymanetMethod}</span>
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
                {cartItems?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td className="py-2">
                      <Link href={`/product/${item.slug}`}>
                        <a>
                          <div className="flex items-center">
                            <div className="w-1/3 h-24 overflow-hidden relative bg-gray-100">
                              <Image
                                src={
                                  item.productImg.data[0].attributes.formats
                                    .thumbnail.url
                                }
                                layout="fill"
                                loading="eager"
                                alt={item.productImg.data[0].attributes.name}
                              />
                            </div>
                            <div className="mx-2 capitalize">{item.name}</div>
                          </div>
                        </a>
                      </Link>
                    </td>
                    <td>{item.color}</td>
                    <td>{item.size}</td>
                    <td className="text-gray-400 line-through">
                      ${item.price}
                    </td>
                    <td className="text-secondary">
                      ${item.offer ? item.offer : 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:col-span-1 shadow-md  px-4 mx-4">
            {errMessage !== "" ? (
              <div className="my-4 text-error">{errMessage}</div>
            ) : null}
            <div className="flex justify-between my-4">
              <div className="font-semibold">{t("placeorder:items")}</div>
              <div className="">
                ({numItems}){t("placeorder:items")}
              </div>
            </div>
            <div className="flex justify-between my-4">
              <div className="font-semibold">{t("placeorder:price")}</div>
              <div className="">${price}</div>
            </div>
            <div className="flex justify-between my-4">
              <div className="font-semibold">{t("placeorder:tax")}</div>
              <div className="">${taxCost}</div>
            </div>
            <div className="flex justify-between my-4">
              <div className="font-semibold">{t("placeorder:shipping")}</div>
              <div className="">${shippingCost}</div>
            </div>
            <div className="flex justify-between my-4">
              <div className="font-semibold">{t("placeorder:total_cost")}</div>
              <div className="text-secondary">${totalCost}</div>
            </div>
            <button
              onClick={() => handleOrder()}
              className="w-full bg-primary text-white uppercase my-4 py-2"
            >
              {t("placeorder:order")}
            </button>
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
    </Layout>
  );
}
export async function getStaticProps({ locale }) {
  try {
    const pagesRes = await fetch(`${API_URL}/api/pages?populate=*`);
    const pages = await pagesRes.json();
    return {
      props: {
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
