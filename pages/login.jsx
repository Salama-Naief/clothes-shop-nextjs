import Layout from "../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { useContext, useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { API_URL } from "../utils/connectionConfig";
import { Store } from "../utils/Store";

export default function Login({ pages }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.user) {
      router.push(redirect ? redirect : "/");
    }
  }, [state.user, redirect, router]);

  // handle loin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = {
      identifier: email,
      password,
    };
    try {
      const res = await fetch(`${API_URL}/api/auth/local`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const loginUser = await res.json();
      if (loginUser.error) {
        setErrMsg(loginUser.error.message);
        setLoading(false);
      } else {
        dispatch({ type: "USER_LOGIN", payload: loginUser });
        setErrMsg("");
        setLoading(false);
      }
    } catch (err) {
      setErrMsg("error in server connection");
      setLoading(false);
    }
  };
  return (
    <Layout title="login" pages={pages}>
      <div
        className="container mx-auto flex justify-center my-8 px-4 "
        style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
      >
        <div className=" bg-white text-gray-900 bottom-0 right-0 w-full md:w-1/2 border border-primary px-4 md:px-8">
          <div className="text-gray-900 text-2xl md:text-3xl w-full text-center my-6 font-semibold capitalize">
            {t("common:login_here")}
          </div>
          {errMsg && (
            <div className="text-error text-xl w-full text-center my-4 capitalize">
              {errMsg}
            </div>
          )}
          <form className="" onSubmit={handleSubmit}>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="outline-none border border-gray-400 my-4 w-full px-4 py-2"
              placeholder={t("common:email")}
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="outline-none border border-gray-400 my-4 w-full px-4 py-2"
              placeholder={t("common:password")}
            />
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "cursor-wait" : "cursor-pointer"
              } bg-primary py-2 w-full text-white `}
            >
              {loading ? t("common:loading") : t("common:login")}
            </button>
          </form>
          <div className="text-gray-900 my-4">
            <span>{t("common:don't_have_account")}?</span>
            <Link href="/register">
              <a>
                <span className="text-secondary cursor-pointer mx-1">
                  {t("common:register")}
                </span>
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
        ...(await serverSideTranslations(locale, ["common"])),
      },
      revalidate: 10,
    };
  } catch (e) {
    return {
      props: {
        errMsg: true,
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }
}
