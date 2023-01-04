import { useContext, useEffect, useRef, useState } from "react";
import { MdOutlineFavoriteBorder, MdOutlineWifiCalling3 } from "react-icons/md";
import { TbTruckReturn, TbTruckDelivery } from "react-icons/tb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

import SingleProductSliders from "../../components/product/SingleProductSlider";
import Slider from "../../components/home/Slider";
import { API_URL } from "../../utils/connectionConfig";
import { Store } from "../../utils/Store";
import Layout from "../../components/Layout";
import Carousel from "../../components/carousel/Carousel";
import Loading from "../../components/loading/Loading";
import { useTranslation } from "next-i18next";
import Image from "next/image";

function SingleProduct({ shoDetail, product, productId, pages, errMsg }) {
  const { state, dispatch } = useContext(Store);
  const { viewedCart } = state;
  const [qty, setQty] = useState(1);
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productImg, setPImg] = useState(null);
  const [height, setHeight] = useState(0);
  const [windosWidth, setWindowsWidth] = useState(0);
  const imgHight = useRef();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    setWindowsWidth(window.innerWidth);
    setHeight(imgHight.current?.offsetHeight);
    setLoading(false);
    dispatch({ type: "ADD_VIEWED_CARD", payload: product });
  }, [imgHight, loading, product]);

  const handleUpdate = () => {
    const quantity = parseInt(qty);
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, id: productId, quantity: quantity },
    });
  };

  //check data frist
  if (errMsg) {
    return (
      <Layout>
        <div className="text-3xl w-full h-screen flex justify-center items-center text-secondary">
          <div>{t("product:backend_err")}</div>
        </div>
      </Layout>
    );
  }

  //loading

  if (loading) {
    return (
      <Layout
        title={`product-${product.name}`}
        desc={product.meta_desc}
        pages={pages}
      >
        <Loading />
      </Layout>
    );
  }
  return (
    <Layout
      title={`product-${product.name}`}
      desc={product.meta_desc}
      pages={pages}
    >
      <div className="container relative  mx-auto my-4 h-fit font-serif">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div ref={imgHight} className="col-span-1 h-full text-center">
            <SingleProductSliders
              type="product"
              setPImg={setPImg}
              product={product}
            />
            <button className="my-4 border border-gray-400 w-1/2 py-4 font-semibold ">
              <div className="flex items-center justify-center">
                <MdOutlineWifiCalling3 className="text-3xl " />
                <span className="mx-2">{t("product:ask_expert")}</span>
              </div>
            </button>
          </div>
          <div
            className="col-span-1  py-4 mx-4  md:mx-8 overflow-y-auto overflow-x-hidden scroll-smooth"
            style={
              windosWidth > 600 ? { height: `${height}px` } : { height: "auto" }
            }
          >
            <div className="flex text-gray-400">
              <span>/Home </span>
              <span>/Collection name </span>
              <span>/{product.name} </span>
            </div>
            <div className="text-3xl py-4 font-bold">{product.name}</div>
            <div className="py-2 text-gray-400">
              {t("product:in_stock")}:{" "}
              <span className="text-gray-900">
                {product.numberInStock} {t("product:in_stock")}
              </span>
            </div>
            <div className="py-2 text-gray-400">
              {t("product:product_type")}:{" "}
              <span className="text-gray-900">{product.type}</span>
            </div>
            <div className="flex justify-between">
              <div className="py-4 text-3xl font-bold line-through text-gray-400 decoration-secondary">
                ${product.price}
              </div>
              <div className="py-4 text-3xl font-bold text-secondary">
                ${product.offer}
              </div>
            </div>

            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
            <div className="text-gray-400 mt-8">
              {t("product:Color")} :{" "}
              <span className="text-gray-900">{product.color}</span>
            </div>
            <div className="w-20 h-32 shadow-lg relative hover:shadow-secondary transition ease-in-out delay-0 duration-400">
              <Image
                src={
                  productImg
                    ? productImg
                    : product.productImg.data[0].attributes.formats.thumbnail
                        .url
                }
                layout="fill"
                objectFit="contain"
                loading="eager"
                objectPosition="center"
                alt=""
              />
            </div>
            <div className="text-gray-400 mt-8 py-2">
              {t("product:Size")} :{" "}
              <span className="text-gray-900">{product.size}</span>
            </div>
            <div className="border border-gray-400 py-2 px-8 w-fit shadow-lg hover:shadow-primary transition ease-in-out delay-0 duration-500 cursor-pointer">
              {product.size}
            </div>
            <div className="py-8 text-error">
              {t("product:Harry_up")} <span>{product.numberInStock}</span>{" "}
              {t("product:left")}{" "}
            </div>
            <div className="md:flex ">
              <div className="flex justify-between my-4 md:my-0">
                <div className="border border-gray-400 p-4 w-fit flex justify-center mx-4">
                  <input
                    type="number"
                    onChange={(e) => setQty(e.target.value)}
                    className="text-xl outline-none w-12"
                    value={qty}
                    min={1}
                  />
                </div>
                <button className="border border-gray-400 p-4 w-fit mx-4 flex md:hidden justify-center ">
                  <MdOutlineFavoriteBorder className="text-2xl" />
                </button>
              </div>
              <button
                onClick={() => handleUpdate()}
                className="border border-primary bg-primary md:flex-grow text-white p-4 w-full flex justify-center text-xl "
              >
                {t("product:add_to_card")}
              </button>
              <button className="transition ease-in-out delay-0 duration-400 hover:bg-secondary hover:text-white border border-gray-400 p-4 w-fit mx-4 md:flex hidden justify-center ">
                <MdOutlineFavoriteBorder className="text-2xl" />
              </button>
            </div>
            <div className="md:px-4">
              <Link href="/shipping">
                <button className="my-8 transition ease-in-out delay-0 duration-400 hover:bg-primary hover:text-white border border-primary bg-white  text-gray-900 p-4 w-full flex justify-center text-xl ">
                  {t("product:buy_now")}
                </button>
              </Link>
            </div>

            <div className="text-gray-400 my-4 py-2 text-xl font-semibold">
              {t("product:total")}:{" "}
              <span className=" mx-1 text-primary">
                {product.offer > 0 ? product.offer * qty : product.price * qty}$
              </span>
            </div>
            {shoDetail && shoDetail.attributes.FreeShippingDatails && (
              <div className="text-gray-500 my-4 py-2 text-sm">
                <div className="flex items-center cursor-pointer">
                  <TbTruckDelivery className="text-3xl" />
                  <span className="text-gray-900 font-semibold mx-2">
                    {shoDetail.attributes.FreeShipping}
                  </span>
                </div>
                <p
                  className="text-gray-400 mx-4 mt-2 cursor-pointer"
                  dangerouslySetInnerHTML={{
                    __html: shoDetail.attributes.FreeShippingDatails,
                  }}
                />
              </div>
            )}
            <div className="text-gray-500 my-4 py-2 text-sm">
              {shoDetail && shoDetail.attributes.FreeReturn && (
                <div className="flex items-center cursor-pointer">
                  <TbTruckReturn className="text-3xl" />
                  <span
                    className="text-gray-900 font-semibold mx-2"
                    onClick={() => {
                      setOverlay(true);
                    }}
                  >
                    {shoDetail.attributes.FreeReturn}
                  </span>
                </div>
              )}
              <div
                className="text-gray-400 mx-4 mt-2 cursor-pointer"
                onClick={() => {
                  setOverlay(true);
                }}
              >
                {t("product:read_more")}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full px-4">
          <div className="md:text-center my-4 md:w-2/3">
            <div className="text-3xl text-gray-900">
              {t("product:Discription")}
            </div>
            <p
              className="text-gray-700 my-8"
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
          </div>
        </div>
        <div className="">
          <div className="my-8">
            <hr />
          </div>

          {viewedCart.length > 0 && (
            <Carousel
              type="recentViewed"
              title={`Recent Viewed`}
              products={viewedCart}
            />
          )}
        </div>
        {overlay && shoDetail && (
          <div
            onClick={() => setOverlay(false)}
            className="fixed opacity-90 w-screen z-30 h-screen top-0 left-0 flex justify-center items-center bg-stone-400"
          >
            <div className="bg-white md:w-1/2 h-fit p-8  ">
              <div className="text-3xl text-center ">
                Policy of Shipping&&Return{" "}
              </div>
              <div className="text-gray-700 my-8">
                <p
                  className="text-gray-900 mx-4 mt-2 cursor-pointer"
                  dangerouslySetInnerHTML={{
                    __html: shoDetail.attributes.FreeReturnDtails,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const paths = [];

  const resEn = await fetch(`${API_URL}/api/products?locale=${locales[0]}`);
  const dataEn = await resEn.json();
  const resAr = await fetch(`${API_URL}/api/products?locale=${locales[1]}`);
  const dataAr = await resAr.json();

  const pages = [...dataEn.data, ...dataAr.data];

  pages.map((product) => {
    paths.push(
      { params: { slug: product.attributes.slug }, locale: locales[1] },
      { params: { slug: product.attributes.slug }, locale: locales[0] }
    );
  });

  return {
    paths,
    fallback: true,
  };
}
export async function getStaticProps(ctx) {
  const locale = ctx.locale;
  try {
    const { slug } = ctx.params;
    const pagesRes = await fetch(
      `${API_URL}/api/pages?locale=${locale}&populate=*`
    );
    const pages = await pagesRes.json();

    const productRes = await fetch(
      `${API_URL}/api/products?locale=${locale}&filters[slug][$eq]=${slug}&&populate=*`
    );
    const product = await productRes.json();

    //shop detais
    const shoDetailRes = await fetch(
      `${API_URL}/api/shop-detaillocale=${locale}`
    );
    const shoDetail = await shoDetailRes.json();
    return {
      props: {
        product: product.data[0].attributes,
        productId: product.data[0].id,
        pages: pages.data,
        shoDetail: shoDetail.data,
        errMsg: false,
        ...(await serverSideTranslations(locale, ["common", "product"])),
      },
      revalidate: 10,
    };
  } catch (err) {
    return {
      props: {
        errMsg: true,
        ...(await serverSideTranslations(locale, ["common", "product"])),
      },
    };
  }
}

export default SingleProduct;
