import Cookies from "js-cookie";
import { i18n, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import Stipper from "../components/payments/Stipper";
import { API_URL } from "../utils/connectionConfig";
import { Store } from "../utils/Store";

export default function Shipping({ pages }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const [fullname, setFullname] = useState(
    state.cart.shipping ? state.cart.shipping.fullname : ""
  );
  const [address, setAddress] = useState(
    state.cart.shipping ? state.cart.shipping.address : ""
  );
  const [city, setCity] = useState(
    state.cart.shipping ? state.cart.shipping.city : ""
  );
  const [postalCode, setPostalCode] = useState(
    state.cart.shipping ? state.cart.shipping.postalCode : ""
  );
  const [countary, setCountary] = useState(
    state.cart.shipping ? state.cart.shipping.countary : ""
  );
  const [phone, setPhone] = useState(
    state.cart.shipping ? state.cart.shipping.phone : ""
  );
  const { t } = useTranslation();

  if (!state.user) {
    router.push("/login?redirect=/shipping");
  }
  if (state.cart.cartItems.length <= 0) {
    router.push("/");
  }
  /* useEffect(()=>{

  },[state,router])*/

  const handeSubmit = (e) => {
    e.preventDefault();
    if (
      fullname !== "" &&
      address !== "" &&
      city !== "" &&
      postalCode !== "" &&
      countary !== ""
    ) {
      dispatch({
        type: "ADD_SHIPPING",
        payload: { fullname, phone, address, city, postalCode, countary },
      });
      router.push("/payment");
    }
  };
  return (
    <Layout title="shipping page" pages={pages}>
      <div className="container mx-auto my-10 text-center ">
        <div className="w-full md:w-2/3 mx-auto my-4">
          <Stipper />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold my-4">
          {t("common:shipping")}
        </h1>

        <div className="flex justify-center">
          <div className=" w-full md:w-1/2 p-4 ">
            <form action="" onSubmit={handeSubmit}>
              <div className="my-4">
                <div
                  className={`${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  } text-sm text-gray-900`}
                >
                  {t("common:full_name")}
                </div>
                <input
                  type="text"
                  onChange={(e) => setFullname(e.target.value)}
                  value={fullname}
                  className="text-gray-900 transition ease-in-out delay-0 duration-500 outline-none border focus:border-secondary border-gray-400 w-full px-4 py-1.5"
                  required
                  min={3}
                  placeholder={t("common:full_name")}
                />
              </div>
              <div className="my-4">
                <div
                  className={`${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  } text-sm text-gray-900`}
                >
                  {t("common:address")}
                </div>
                <input
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  className="text-gray-900 transition ease-in-out delay-0 duration-500 outline-none border focus:border-secondary border-gray-400 w-full px-4 py-1.5"
                  required
                  min={3}
                  placeholder={t("common:address")}
                />
              </div>
              <div className="my-4">
                <div
                  className={`${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  } text-sm text-gray-900`}
                >
                  {t("common:phone")}
                </div>
                <input
                  type="number"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  className="text-gray-900 transition ease-in-out delay-0 duration-500 outline-none border focus:border-secondary border-gray-400 w-full px-4 py-1.5"
                  required
                  min={3}
                  placeholder={t("common:phone")}
                />
              </div>
              <div className="my-4">
                <div
                  className={`${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  } text-sm text-gray-900`}
                >
                  {t("common:city")}
                </div>
                <input
                  type="text"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  className="text-gray-900 transition ease-in-out delay-0 duration-500 outline-none border focus:border-secondary border-gray-400 w-full px-4 py-1.5"
                  required
                  min={3}
                  placeholder={t("common:city")}
                />
              </div>
              <div className="my-4">
                <div
                  className={`${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  } text-sm text-gray-900`}
                >
                  {t("common:postal_code")}
                </div>
                <input
                  type="text"
                  onChange={(e) => setPostalCode(e.target.value)}
                  value={postalCode}
                  className="text-gray-900 transition ease-in-out delay-0 duration-500 outline-none border focus:border-secondary border-gray-400 w-full px-4 py-1.5"
                  required
                  min={3}
                  placeholder={t("common:postal_code")}
                />
              </div>
              <div className="my-4">
                <div
                  className={`${
                    i18n.language === "ar" ? "text-right" : "text-left"
                  } text-sm text-gray-900`}
                >
                  {t("common:country")}{" "}
                </div>
                <input
                  type="text"
                  onChange={(e) => setCountary(e.target.value)}
                  value={countary}
                  className="text-gray-900 transition ease-in-out delay-0 duration-500 outline-none border focus:border-secondary border-gray-400 w-full px-4 py-1.5"
                  required
                  min={3}
                  placeholder={t("common:country")}
                />
              </div>
              <button
                type="submit"
                className="bg-primary py-2 w-full text-center uppercase text-white my-2"
              >
                {t("common:continue")}
              </button>
            </form>
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
        ...(await serverSideTranslations(locale, ["common"])),
      },
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
