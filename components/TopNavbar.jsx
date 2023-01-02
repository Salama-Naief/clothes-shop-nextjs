import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_URL } from "../utils/connectionConfig";
import { Store } from "../utils/Store";
import { MdOutlineShoppingBasket, MdOutlineClear } from "react-icons/md";
import { TbHeart } from "react-icons/tb";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import MenuCart from "./menuCart/MenuCart";
import { useRouter } from "next/router";

function TopNavbar({ pages }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const [hoverPage, setHoverPage] = useState(null);
  const [pageQuery, setPageQuery] = useState(null);
  const [typeQuery, setTypeQuery] = useState(null);
  const [cartProduct, setCartProduct] = useState([]);
  const pagesContent = pages.length > 0 ? pages : state.pages;
  const [menuCart, setMenuCart] = useState(false);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    setCartProduct(state.cart.cartItems);

    setPageQuery(router.query.p ? router.query.p : null);
    const type = router.query?.genre?.split("-");

    if (
      (type && type[0] === "collections") ||
      (type && type[0] === "category")
    ) {
      setTypeQuery(type[1]);
    } else {
      setTypeQuery(null);
    }
  }, [state, router.query]);

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

  return (
    <div
      className={`w-full z-20  top-0 font-serif sticky shadow-xl border-t md:block hidden `}
    >
      <div
        className={`px-2 z-10 flex justify-between  bg-white w-full text-gray-900 py-2.5`}
      >
        <div className="container flex justify-between mx-auto text-base">
          <div className="flex">
            {pagesContent.map((page) => (
              <div
                key={page.id}
                onMouseOver={() => setHoverPage(page.attributes.name)}
                onMouseOut={() => setHoverPage(null)}
                className="relative"
              >
                <div
                  className={`relative hover:bg-secondary hover:text-white mx-1 md:mx-4 px-1 md:px-3 py-1 capitalize ${
                    pageQuery === page.attributes.name
                      ? "bg-secondary text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <Link
                    href={`${
                      page.attributes.slug === "home" ||
                      page.attributes.slug === "home-ar"
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
                  {page.attributes.name === hoverPage &&
                    page.attributes.slug !== "home" &&
                    page.attributes.slug !== "home-ar" && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={
                          page.attributes.name === hoverPage
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 50 }
                        }
                        transition={{ duration: 0.2 }}
                        className={`${
                          i18n.language === "ar" ? "right-0" : "left-0"
                        } flex absolute top-8 h-40 bg-white w-fit z-30 border border-primary`}
                      >
                        <div className="flex">
                          {page.attributes.categories.data.length > 0 && (
                            <div className="capitalize text-gray-900 p-4 mx-2">
                              <div className="text-xl  font-md">categoy</div>
                              {page.attributes.categories.data.map(
                                (category) => (
                                  <Link
                                    key={category.id}
                                    href={`/products/category-${category.attributes.slug}?p=${page.attributes.name}`}
                                  >
                                    <a>
                                      <div
                                        className={`${
                                          typeQuery &&
                                          (typeQuery ===
                                          category.attributes.slug
                                            ? "bg-secondary text-white"
                                            : "bg-white text-gray-600 ")
                                        } px-2 test-sm  py-1 transition ease-in-out  duration-600 hover:bg-secondary hover:text-white`}
                                      >
                                        {category.attributes.name}
                                      </div>
                                    </a>
                                  </Link>
                                )
                              )}
                            </div>
                          )}
                          {page.attributes.collections.data.length > 0 && (
                            <div className="capitalize text-gray-900 p-4 w-fit mx-2">
                              <div className="text-xl  font-md">
                                collections
                              </div>
                              {page.attributes.collections.data.map(
                                (collection) => (
                                  <Link
                                    key={collection.id}
                                    href={`/products/collections-${collection.attributes.slug}?p=${page.attributes.name}`}
                                  >
                                    <a>
                                      <div
                                        className={`${
                                          typeQuery &&
                                          (typeQuery ===
                                          collection.attributes.slug
                                            ? "bg-secondary text-white"
                                            : "bg-white text-gray-600 ")
                                        } text-sm  px-2 w-fit py-1 transition ease-in-out delay-100 duration-400 hover:bg-secondary hover:text-white`}
                                      >
                                        {collection.attributes.name}
                                      </div>
                                    </a>
                                  </Link>
                                )
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex justify-center ">
                          {page.attributes.newImg.data && (
                            <Link
                              href={`/products/new-${page.attributes.slug}?P=${page.attributes.name}`}
                            >
                              <a>
                                <div className="h-full w-28 mx-2 relative">
                                  <Image
                                    src={
                                      page.attributes.newImg.data.attributes
                                        .formats.thumbnail.url
                                    }
                                    width={100}
                                    height={100}
                                    loading="eager"
                                    layout="responsive"
                                    alt="ss"
                                  />
                                  <div className="font-semibold bg-gray-100 text-sm text-gray-900 absolute bottom-0 left-0 z-20 w-full text-center border border-secondary">
                                    {page.attributes.newText}
                                  </div>
                                </div>
                              </a>
                            </Link>
                          )}
                          {page.attributes.offerImg.data && (
                            <Link
                              href={`/products/sales-${page.attributes.slug}?P=${page.attributes.name}`}
                            >
                              <a>
                                <div className="h-full w-28 mx-2 relative">
                                  <Image
                                    src={
                                      page.attributes.offerImg.data.attributes
                                        .formats.thumbnail.url
                                    }
                                    width={100}
                                    height={100}
                                    loading="eager"
                                    layout="responsive"
                                    alt="ss"
                                  />
                                  <div className="font-semibold bg-gray-100 text-sm text-gray-900 absolute bottom-0 left-0 z-20 w-full text-center border border-secondary">
                                    {page.attributes.offerText}
                                  </div>
                                </div>
                              </a>
                            </Link>
                          )}
                          {page.attributes.popularImg.data && (
                            <Link
                              href={`/products/popular-${page.attributes.slug}?P=${page.attributes.name}`}
                            >
                              <a>
                                {" "}
                                <div className="h-full w-28 mx-2 relative">
                                  <Image
                                    src={
                                      page.attributes.popularImg.data.attributes
                                        .formats.thumbnail.url
                                    }
                                    width={100}
                                    height={100}
                                    loading="eager"
                                    layout="responsive"
                                    alt="ss"
                                  />
                                  <div className="font-semibold bg-gray-100 text-sm text-gray-900 absolute bottom-0 left-0 z-20 w-full text-center border border-secondary">
                                    {page.attributes.popularText}
                                  </div>
                                </div>
                              </a>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex">
            <div
              className="mx-1 flex justify-end relative text-gray-900"
              onClick={() => setMenuCart(true)}
            >
              <MdOutlineShoppingBasket className="text-3xl font-light cursor-pointer" />
              <div className="absolute bg-secondary bottom-6 -right-1 text-white flex justify-center items-center px-0.5 md:px-1 text-sm rounded-full">
                {state.cart.cartItems.length > 0
                  ? state.cart.cartItems.length
                  : "0"}
              </div>
            </div>
          </div>
        </div>
        {/*menu cart*/}
        {menuCart && <MenuCart setMenuCart={setMenuCart} />}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(TopNavbar), { ssr: false });
