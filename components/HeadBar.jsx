import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MdOutlineDehaze,
  MdOutlinePersonOutline,
  MdOutlineSearch,
  MdOutlineShoppingBasket,
  MdOutlineClear,
  MdChevronRight,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { API_URL } from "../utils/connectionConfig";
import { Store } from "../utils/Store";
import { useTranslation } from "next-i18next";

import { I18nContext } from "next-i18next";
import { i18n } from "next-i18next";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import MenuCart from "./menuCart/MenuCart";

const HeadBar = ({ pages }) => {
  const router = useRouter();
  const { pathname, query, asPath } = router;
  const { state, dispatch } = useContext(Store);
  const pagesContent = pages.length > 0 ? pages : state.pages;
  const [cartProduct, setCartProduct] = useState([]);
  const [user, setUser] = useState(null);
  const [menuUser, setMenuUser] = useState(false);
  const [menuCart, setMenuCart] = useState(false);
  const [menuItems, setMenItems] = useState(false);
  const [pageItems, setPageItems] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setCartProduct(state.cart.cartItems);
    setUser(state.user);
  }, [state, cartProduct]);

  useEffect(() => {
    router.push({ pathname, query }, asPath, { locale: i18n.language });
  }, [i18n.language]);
  const handleUpdate = (qty, product) => {
    const quantity = parseInt(qty);
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: quantity },
    });
  };

  const handleRemoceCart = (product) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { ...product } });
  };
  const closeMenus = () => {
    setMenItems(false);
    setMenuCart(false);
  };
  const handleMenus = (type) => {
    switch (type) {
      case "cart":
        setMenItems(false);
        setMenuCart(true);
        break;
      case "items":
        setMenItems(true);
        setMenuCart(false);
        break;

      default:
        setMenItems(false);
        setMenuCart(false);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "USER_LOGOUT" });
  };

  return (
    <div className="container sticky md:static top-0 z-30 md:z-0 w-full bg-white mx-auto flex items-center justify-between py-2 px-2 md:px-0 shadow-sm md:shadow-none font-serif">
      <div className="w-1/2 md:w-1/3 text-xl md:text-3xl font-serif text-gray-900 flex items-center ">
        <MdOutlineDehaze
          className="text-2xl cursor-pointer mx-2 md:hidden"
          onClick={() => handleMenus("items")}
        />
        <Link href="/">
          <a>{t("common:siteName")}</a>
        </Link>{" "}
      </div>
      <form className="hidden md:flex w-1/3 text-gray-900 border border-gray-400 items-center">
        <div className="flex items-center w-full">
          <input
            type="text"
            className="flex-grow outline-none px-1 py-0 text-sm md:text-base md:px-4 md:py-1"
            placeholder={t("common:search")}
          />
          <MdOutlineSearch className="text-3xl cursor-pointer " />
        </div>
      </form>
      <div className="w-1/2 md:w-1/3 flex  items-center">
        <div className=" w-full items-center flex justify-end md:justify-between">
          {!user ? (
            <div className="hidden md:flex w-full justify-end items-center mx-1">
              <Link href="/login">
                <a className="p-1 rounded-full border border-secondary text-gray-900">
                  <MdOutlinePersonOutline className="text-2xl cursor-pointer" />
                </a>
              </Link>
            </div>
          ) : (
            <div className="relative md:w-full hidden md:flex justify-end">
              <div className="relative">
                <div
                  onClick={() => setMenuUser(!menuUser)}
                  className="border capitalize border-primary text-gray-900 text-sm py-0.5 px-1 md:text-base md:px-2 md:py-1 cursor-pointer"
                >
                  {user.user.username}
                </div>
                {
                  <motion.div
                    initial={{ display: "none" }}
                    animate={
                      menuUser ? { display: "block" } : { display: "none" }
                    }
                    className="absolute top-8 left-0 z-30 border border-primary bg-white py-4 px-2"
                  >
                    <button className="py-2 text-center px-4 capitalize hover:bg-secondary hover:text-white">
                      {user.user.username}
                    </button>
                    <button className="py-2 text-center px-4 hover:bg-secondary hover:text-white">
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="py-2 text-center px-4 hover:bg-secondary hover:text-white"
                    >
                      Logout
                    </button>
                  </motion.div>
                }
              </div>
            </div>
          )}

          <div
            className="md:hidden w-1/2 mx-1 flex justify-end relative text-gray-900"
            onClick={() => handleMenus("cart")}
          >
            <MdOutlineShoppingBasket className="text-2xl md:text-4xl cursor-pointer" />
            <div className="absolute bg-secondary bottom-4 md:bottom-6 right-0 text-white px-1 md:px-2 text-sm rounded-full">
              {state.cart.cartItems.length > 0
                ? state.cart.cartItems.length
                : "0"}
            </div>
          </div>
        </div>
        <div className="mx-1">
          <select
            name=""
            id=""
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="px-4 py-1 outline-none appearance-none border border-primary text-gray-900 cursor-pointer"
          >
            <option
              value="en"
              className={`bg-white text-gray-900 appearance-none`}
            >
              English
            </option>
            <option
              value="ar"
              className={`bg-white text-gray-900 appearance-none`}
            >
              العربية
            </option>
          </select>
        </div>
      </div>

      {/*menu cart of product*/}
      {menuCart && <MenuCart setMenuCart={setMenuCart} />}

      {/*small size menu*/}
      {
        <motion.div
          initial={{ x: i18n.language === "ar" ? 400 : -400, display: "none" }}
          animate={menuItems ? { x: 0, display: "block" } : { display: "none" }}
          transition={{ duration: 0.2, type: "just" }}
          className={`${
            i18n.language === "ar" ? "right-0" : "left-0"
          } z-50 md:hidden bg-white text-gray-900 fixed bottom-0 w-5/6 md:w-1/3 md:h-5/6 border border-gray-400 px-8 h-screen overflow-y-auto overflow-x-hidden `}
        >
          <div
            className={`${
              i18n.language === "ar" ? "left-5" : "right-5"
            } absolute top-5  text-xl md:text-2xl p-0.5 md:p-1 border border-secondary rounded-full cursor-pointer`}
            onClick={() => closeMenus()}
          >
            <MdOutlineClear />
          </div>
          <div className="text-gray-900 text-xl md:text-3xl w-full text-center my-6 capitalize">
            {t("common:menu")}
          </div>
          <div className="flex justify-center items-center mx-1">
            {user ? (
              <div className="relative py-2 text-center border capitalize border-gray-400">
                <div
                  onClick={() => setMenuUser(!menuUser)}
                  className="font-bold text-gray-900 text-sm py-0.5 px-4 cursor-pointer"
                >
                  {user.user.username}
                </div>
                {
                  <motion.div
                    initial={{ display: "none" }}
                    animate={
                      menuUser ? { display: "block" } : { display: "none" }
                    }
                    className="text-center py-4 px-2"
                  >
                    <div className="bg-secondary h-0.5 w-full"></div>
                    <button className=" block px-4 py-2  text-center capitalize hover:bg-secondary hover:text-white">
                      {user.user.username}
                    </button>
                    <button className="blockp py-2 px-4 text-center hover:bg-secondary hover:text-white">
                      {t("common:profile")}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-center hover:bg-secondary hover:text-white"
                    >
                      {t("common:logout")}
                    </button>
                  </motion.div>
                }
              </div>
            ) : (
              <div className="flex justify-center items-center mx-1">
                <Link href={"/login"} passHref>
                  <a className="p-1 rounded-full border border-gray-400 text-gray-900">
                    <MdOutlinePersonOutline className="text-4xl cursor-pointer" />
                  </a>
                </Link>
              </div>
            )}
          </div>
          <form className="my-4 text-gray-900 border border-gray-400 flex items-center">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-grow-1 outline-none  w-full px-4 py-2"
                placeholder={t("common:search")}
              />
              <MdOutlineSearch className="text-3xl cursor-pointer" />
            </div>
          </form>
          <div className=" text-base ">
            {pagesContent.map((page) => (
              <div key={page.id} className="px-4 my-4 relative py-1.5 border">
                <div className="w-full flex justify-between font-semibold capitalize">
                  <Link
                    href={`${
                      page.attributes.name == "home"
                        ? "/"
                        : `/products/all-${page.attributes.slug}`
                    }`}
                  >
                    <a>
                      <span className="font-bold cursor-pointer">
                        {page.attributes.name}
                      </span>
                    </a>
                  </Link>
                  <div>
                    <motion.span
                      initial={{ display: "block" }}
                      animate={
                        pageItems === page.attributes.name
                          ? { display: "none" }
                          : { display: "block" }
                      }
                      onClick={() =>
                        setPageItems(
                          pageItems !== page.attributes.name
                            ? page.attributes.name
                            : ""
                        )
                      }
                    >
                      <MdChevronRight className="text-2xl text-gray-400 mx-1 cursor-pointer" />
                    </motion.span>
                    <motion.span
                      initial={{ display: "none" }}
                      animate={
                        pageItems === page.attributes.name
                          ? { display: "block" }
                          : { display: "none" }
                      }
                      onClick={() => setPageItems("")}
                    >
                      <MdKeyboardArrowDown className="text-2xl text-gray-400 mx-1 cursor-pointer" />
                    </motion.span>
                  </div>
                </div>

                {page.attributes.name !== "home" && (
                  <motion.div
                    initial={{ opacity: 0, display: "none" }}
                    animate={
                      pageItems === page.attributes.name
                        ? { display: "block", opacity: 1 }
                        : { display: "none", opacity: 0 }
                    }
                    className=""
                  >
                    {page.attributes.newImg.data && (
                      <Link href={`/products/new-${page.attributes.slug}`}>
                        <a>
                          <div className="min-h-fit w-full mx-2 relative my-2">
                            <Image
                              src={page.attributes.newImg.data.attributes.url}
                              width={200}
                              height={200}
                              loading="eager"
                              alt={
                                page.attributes.offerImg.data.attributes.name
                              }
                            />
                            <div className="font-semibold bg-gray-100 text-sm text-gray-900 absolute bottom-0 left-0 z-20 w-full text-center border border-secondary">
                              {page.attributes.newText}
                            </div>
                          </div>
                        </a>
                      </Link>
                    )}
                    {page.attributes.offerImg.data && (
                      <Link href={`/products/sales-${page.attributes.slug}`}>
                        <a>
                          {" "}
                          <div className="min-h-fit w-full mx-2 relative my-2">
                            <Image
                              src={page.attributes.offerImg.data.attributes.url}
                              width={200}
                              height={200}
                              loading="eager"
                              alt={
                                page.attributes.offerImg.data.attributes.name
                              }
                            />
                            <div className="font-semibold bg-gray-100 text-sm text-gray-900 absolute bottom-0 left-0 z-20 w-full text-center border border-secondary">
                              {page.attributes.offerText}
                            </div>
                          </div>
                        </a>
                      </Link>
                    )}
                    {page.attributes.popularImg.data && (
                      <Link href={`/products/popular-${page.attributes.slug}`}>
                        <a>
                          {" "}
                          <div className="min-h-fit w-full mx-2 relative my-2">
                            <Image
                              src={
                                page.attributes.popularImg.data.attributes.url
                              }
                              width={200}
                              height={200}
                              loading="eager"
                              alt={
                                page.attributes.offerImg.data.attributes.name
                              }
                            />
                            <div className="font-semibold bg-gray-100 text-sm text-gray-900 absolute bottom-0 left-0 z-20 w-full text-center border border-secondary">
                              {page.attributes.popularText}
                            </div>
                          </div>
                        </a>
                      </Link>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      }
    </div>
  );
};

export default dynamic(() => Promise.resolve(HeadBar), { ssr: false });
