import { i18n, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import Stipper from "../components/payments/Stipper";
import { API_URL } from "../utils/connectionConfig";
import { Store } from "../utils/Store";

export default function Pyament({ pages }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const {
    cart: { cartItems, paymanetMethod, shipping },
  } = state;
  const [paymentMathod, setPaymantMathod] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (!shipping) {
      router.push("/shipping");
    }
    if (cartItems <= 0) {
      router.push("/");
    }
    setPaymantMathod(paymanetMethod);
  }, [shipping, cartItems, paymanetMethod, router]);

  const handlePaymentMetod = (e) => {
    e.preventDefault();
    if (paymentMathod !== "") {
      dispatch({ type: "ADD_PAYMENT_METHOD", payload: paymentMathod });
      router.push("/placeorder");
    }
  };
  return (
    <Layout title="payments" pages={pages}>
      <div className="container mx-auto px-2 my-10">
        <div className="w-full md:w-2/3 mx-auto my-4">
          <Stipper />
        </div>
        <h1 className="text-2xl md:text-3xl my-4 font-bold w-full text-center ">
          {t("common:payments")}
        </h1>

        <div className="w-full md:w-1/2 mx-auto shadow flex justify-center flex-col my-4 p-4">
          <div
            className={`${
              i18n.language === "ar" ? "text-right" : "text-left"
            } my-4 font-semibold text-xl`}
          >
            {" "}
            {t("common:payment_method")}
          </div>
          <form onSubmit={handlePaymentMetod}>
            <label className="block my-2">
              <input
                type="radio"
                value="paypal"
                checked={paymentMathod === "paypal" ? paymentMathod : ""}
                name="paypal"
                onChange={(e) => setPaymantMathod(e.target.value)}
              />{" "}
              <span className="text-lg">{t("common:paypal")}</span>
            </label>
            <label className=" block my-2">
              <input
                type="radio"
                value="stripe"
                checked={paymentMathod === "stripe" ? paymentMathod : ""}
                name="stripe"
                onChange={(e) => setPaymantMathod(e.target.value)}
              />{" "}
              <span className="text-lg">{t("common:stripe")}</span>
            </label>
            <button
              type="submit"
              className="bg-primary text-white uppercase py-2 w-full text-center my-4"
            >
              {t("common:continue")}
            </button>
            <Link href={`/shipping`} passHref>
              <a>
                <div className="w-full text-center bg-gray-50 text-gray-900 uppercase py-2 border border-secondary">
                  {t("common:back")}
                </div>
              </a>
            </Link>
          </form>
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
        ...(await serverSideTranslations(locale, ["common"])),
      },
      revalidate: 10,
    };
  } catch (err) {
    return {
      props: {
        errMsg: true,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }
}
