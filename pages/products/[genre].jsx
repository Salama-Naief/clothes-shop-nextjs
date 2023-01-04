import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useRef, useState } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import ProductCard from "../../components/product/ProductCard";
import { API_URL } from "../../utils/connectionConfig";
import Loading from "../../components/loading/Loading";
import { useTranslation } from "next-i18next";
import Image from "next/image";

function Products({ products, pages, errMsg, randumImg }) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [productItems, setproductItems] = useState(products);
  const [maxPrice, setMaxPrice] = useState(0);
  const [miniPrice, setMiniPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  // const [sizeArray,setSizeArray]=useState("");
  // const [categoryArray,setCategoryArray]=useState("");
  // const [colorArray,setColorArray]=useState("");
  const [sideFilter, setSideFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const progres = useRef();

  //loading
  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    setproductItems(products);
    setPrice(maxPrice);
  }, [products]);

  useEffect(() => {
    progres.current &&
      (progres.current.style.width = `${
        ((price - miniPrice) / (maxPrice - miniPrice)) * 100
      }%`);
  }, [price, progres, maxPrice, miniPrice, i18n.language]);

  const colorArray = [];
  const categoryArray = [];
  const sizeArray = [];
  //  let miniPrice=0;
  // let maxPrice=0;
  products &&
    products.forEach((item) => {
      if (item.attributes.price > maxPrice) {
        //maxPrice=item.attributes.price
        setMaxPrice(item.attributes.price);
      }
      if (item.attributes.price < miniPrice && miniPrice !== 0) {
        //miniPrice=item.attributes.price
        setMiniPrice(item.attributes.price);
      } else if (miniPrice === 0) {
        //miniPrice=item.attributes.price
        setMiniPrice(item.attributes.price);
      }
      if (!colorArray.includes(item.attributes.color)) {
        colorArray.push(item.attributes.color);
      }
      if (!sizeArray.includes(item.attributes.size)) {
        sizeArray.push(item.attributes.size);
      }
      if (
        !categoryArray.includes(
          item.attributes.category.data?.attributes.name
        ) &&
        item.attributes.category.data
      ) {
        categoryArray.push(item.attributes.category.data?.attributes.name);
      }
    });

  /* useEffect(()=>{
      
        setColorArray(colorArr);
        setCategoryArray(categoryArr);
        setSizeArray(sizeArr);
        setMaxPrice(maxPrice)
        setMiniPrice(miniPrice)
    },[products,price])*/

  const handleFliter = (type) => {
    const items = [];
    setSideFilter(false);
    if (type === "price") {
      setCategory("");
      setSize("");
      setColor("");
    } else if (type === "size") {
      setCategory("");
      setPrice(maxPrice);
      setColor("");
    } else if (type === "category") {
      setColor("");
      setSize("");
      setPrice(maxPrice);
    } else if (type === "color") {
      setCategory("");
      setSize("");
      setPrice(maxPrice);
    }
    products.forEach((item) => {
      if (type === "price" && item.attributes.price <= price) {
        items.push(item);
      } else if (type === "size" && item.attributes.size === size) {
        items.push(item);
      } else if (
        type === "category" &&
        item.attributes.category.data?.attributes.name === category &&
        item.attributes.category.data
      ) {
        items.push(item);
      } else if (type === "color" && item.attributes.color === color) {
        items.push(item);
      }
    });
    setproductItems(items);
  };

  const handleAllFliters = () => {
    const items = [];
    setSideFilter(false);
    products &&
      products.forEach((item) => {
        if (
          item.attributes.price <= price &&
          item.attributes.size === size &&
          item.attributes.color === color &&
          item.attributes.category.data?.attributes.name === category &&
          item.attributes.category.data
        ) {
          items.push(item);
        }
      });
    setproductItems(items);
  };

  //check data frist
  if (errMsg) {
    return (
      <Layout>
        <div className="text-3xl w-full h-screen flex justify-center items-center text-secondary">
          <div>No Data Found</div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout title="products pages" pages={pages}>
        <Loading />
      </Layout>
    );
  }
  return (
    <Layout title="products pages" pages={pages}>
      <div className="container relative  mx-auto h-fit font-serif my-8 ">
        {/* <Image src="https://s.wsj.net/public/resources/images/B3-FD456_ONE_OR_574V_20191004141817.jpg" layout='responsive' width={16} height={8} loading="eager"/>*/}
        <div
          onClick={() => setSideFilter(true)}
          className={`fixed ${
            sideFilter ? "hidden" : "block"
          } right-0 top-1/2 z-20 md:hidden`}
        >
          <MdArrowBackIosNew className="text-primary text-4xl cursor-pointer" />
        </div>
        <h1 className="text-3xl font-bold capitalize w-full text-center my-8">
          {router.query.genre}
        </h1>
        <div className="flex relative">
          <div className="flex flex-wrap w-full md:w-3/4">
            {productItems.length > 0 ? (
              productItems?.map((product) => (
                <div key={product.id} className="w-full md:w-1/3 my-4">
                  <ProductCard id={product.id} product={product.attributes} />
                </div>
              ))
            ) : (
              <div className="w-full h-screen flex items-center justify-center">
                <div className="text-xl text-secondary"> No Product Found </div>
              </div>
            )}
          </div>
          <motion.div
            className={` h-screen overflow-y-scroll md:overflow-visible  border md:block bg-white fixed right-0 top-0 z-30 md:z-0 md:static md:h-fit w-3/4 md:w-1/4 p-4 my-4 ${
              sideFilter ? "block" : "hidden"
            }`}
          >
            <div className="relative w-full">
              <motion.div
                initial={{ display: "none" }}
                animate={{ display: sideFilter ? "flex" : "none" }}
                onClick={() => setSideFilter(false)}
                className={`right-2/3 w-fit fixed z-30 h-screen items-center top-1/6 md:hidden`}
              >
                <MdArrowForwardIos className="text-primary text-4xl cursor-pointer" />
              </motion.div>
              <div>
                <div className="pt-4">
                  <div className="text-lg font-semibold py-4">
                    {t("common:price_filter")}
                  </div>
                  <div className="w-full flex items-center">
                    <div className="p-1 border mx-1">${price}</div>
                    <div className="w-full relative h-2 rounded-full bg-gray-100 border px-0.5">
                      <div
                        ref={progres}
                        className="h-full bg-gray-300 absolute z-10 left-0 top-0"
                      ></div>
                      <input
                        type="range"
                        value={price}
                        min={miniPrice}
                        max={maxPrice}
                        step={1}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-transparent  w-full appearance-none absolute z-20 left-0 -top-1 border-none outline-none"
                      />
                    </div>
                    <div className="p-1 border mx-1">${maxPrice}</div>
                  </div>
                  <button
                    onClick={() => handleFliter("price")}
                    className="my-4 transition ease-in-out delay-0 duration-500 border border-primary bg-white text-gray-900 hover:bg-primary py-1 px-8 hover:text-white"
                  >
                    {t("common:filter")}
                  </button>
                </div>

                <div className="px-4">
                  <div className="text-lg font-semibold py-4">
                    {t("common:category_filter")}
                  </div>
                  <label className=" block my-2">
                    <input
                      type="radio"
                      value="allCategory"
                      checked={category === "allCategory" ? category : ""}
                      name="all"
                      onChange={(e) => setCategory(e.target.value)}
                    />{" "}
                    <span className="text-lg">{t("common:all")}</span>
                  </label>
                  {categoryArray.map((categoryVal, index) => (
                    <label key={index} className=" block my-2">
                      <input
                        type="radio"
                        value={categoryVal}
                        checked={category === categoryVal ? category : ""}
                        name={categoryVal}
                        onChange={(e) => setCategory(e.target.value)}
                      />{" "}
                      <span className="text-lg">{categoryVal}</span>
                    </label>
                  ))}
                  <button
                    onClick={() => handleFliter("category")}
                    className="my-4 transition ease-in-out delay-0 duration-500 border border-primary bg-white text-gray-900 hover:bg-primary py-1 px-8 hover:text-white"
                  >
                    {t("common:filter")}
                  </button>
                </div>

                <div className="px-4">
                  <div className="text-lg font-semibold py-4">
                    {t("common:size_filter")}
                  </div>
                  <label className=" block my-2">
                    <input
                      type="radio"
                      value="allSize"
                      checked={size === "allSize" ? size : ""}
                      name="cash"
                      onChange={(e) => setSize(e.target.value)}
                    />{" "}
                    <span className="text-lg">{t("common:all")}</span>
                  </label>
                  {sizeArray.map((sizeVal, index) => (
                    <label key={index} className=" block my-2">
                      <input
                        type="radio"
                        value={sizeVal}
                        checked={size === sizeVal ? size : ""}
                        name={sizeVal}
                        onChange={(e) => setSize(e.target.value)}
                      />{" "}
                      <span className="text-lg">{sizeVal}</span>
                    </label>
                  ))}
                  <button
                    onClick={() => handleFliter("size")}
                    className="my-4 transition ease-in-out delay-0 duration-500 border border-primary bg-white text-gray-900 hover:bg-primary py-1 px-8 hover:text-white"
                  >
                    {t("common:filter")}
                  </button>
                </div>

                <div className="px-4">
                  <div className="text-lg font-semibold py-4">
                    {t("common:color_filter")}
                  </div>
                  <label className=" block my-2">
                    <input
                      type="radio"
                      value="allColor"
                      checked={color === "allColor" ? color : ""}
                      name="allColor"
                      onChange={(e) => setColor(e.target.value)}
                    />{" "}
                    <span className="text-lg">{t("common:all")}</span>
                  </label>
                  {colorArray.map((colorVal, index) => (
                    <label key={index} className=" block my-2">
                      <input
                        type="radio"
                        value={colorVal}
                        checked={color === colorVal ? color : ""}
                        name={colorVal}
                        onChange={(e) => setColor(e.target.value)}
                      />{" "}
                      <span className="text-lg">{colorVal}</span>
                    </label>
                  ))}

                  <button
                    onClick={() => handleFliter("color")}
                    className="my-4 transition ease-in-out delay-0 duration-500 border border-primary bg-white text-gray-900 hover:bg-primary py-1 px-8 hover:text-white"
                  >
                    {t("common:filter")}
                  </button>
                </div>

                <div className="my-4">
                  <div className="text-lg font-semibold py-4">
                    {t("common:filter")}{" "}
                    <span className="text-base font-normal">
                      {t("common:all_fliters")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAllFliters()}
                    className="bg-primary text-white  py-1 px-8 w-full"
                  >
                    {t("common:filter_by_all")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

/*export async function getStaticPaths({ locales }) {
  try {
    const pageCollections = [];
    const pageCategories = [];
    const allItems = [];
    const newItems = [];
    const salesItems = [];
    const popularItems = [];
    const othePaths = [];

    const pageResEn = await fetch(`${API_URL}/api/pages?locale=${locales[0]}`);
    const pagesEn = await pageResEn.json();
    const pageResAr = await fetch(`${API_URL}/api/pages?locale=${locales[1]}`);
    const pagesAr = await pageResAr.json();
    const pages = [...pagesEn.data, ...pagesAr.data];

    const colectinResEn = await fetch(
      `${API_URL}/api/colection-of-products?locale=${locales[0]}`
    );
    const collectionsEn = await colectinResEn.json();
    const colectinResAr = await fetch(
      `${API_URL}/api/colection-of-products?locale=${locales[1]}`
    );
    const collectionsAr = await colectinResAr.json();

    const collections = [...collectionsEn.data, ...collectionsAr.data];

    const categoryResEn = await fetch(
      `${API_URL}/api/categories?locale=${locales[0]}`
    );
    const categoriesEn = await categoryResEn.json();
    const categoryResAr = await fetch(
      `${API_URL}/api/categories?locale=${locales[1]}`
    );
    const categoriesAr = await categoryResAr.json();

    const categories = [...categoriesEn.data, ...categoriesAr.data];

    collections.map((collection) => {
      locales.map((locale) => {
        pageCollections.push({
          params: { genre: `collections-${collection.attributes.slug}` },
          locale,
        });
      });
    });

    categories.map((category) => {
      locales.map((locale) => {
        pageCategories.push({
          params: { genre: `category-${category.attributes.slug}` },
          locale,
        });
      });
    });

    pages.map((page) => {
      locales.map((locale) => {
        allItems.push({
          params: { genre: `all-${page.attributes.slug}` },
          locale,
        });
        newItems.push({
          params: { genre: `new-${page.attributes.slug}` },
          locale,
        });
        salesItems.push({
          params: { genre: `sales-${page.attributes.slug}` },
          locale,
        });
        salesItems.push({
          params: { genre: `popular-${page.attributes.slug}` },
          locale,
        });
      });
    });

    locales.map((locale) => {
      othePaths.push({ params: { genre: `popular-products` }, locale });
      othePaths.push({ params: { genre: `new-products` }, locale });
      othePaths.push({ params: { genre: `sales-products` }, locale });
      othePaths.push({ params: { genre: `collection-products` }, locale });
    });

    const paths = [
      ...pageCollections,
      ...pageCategories,
      ...allItems,
      ...newItems,
      ...salesItems,
      ...popularItems,
      ...othePaths,
    ];

    return {
      paths,
      fallback: true,
    };
  } catch (err) {
    return {
      paths: [],
      fallback: false,
    };
  }
}*/
export async function getServerSideProps(ctx) {
  const { genre } = ctx.params;
  const locale = ctx.locale;
  try {
    const ramdumImgRes = await fetch(
      `${API_URL}/api/locale=${locale}&randum-image?populate=*`
    );
    const ramdumImg = await ramdumImgRes.json();

    const pagesRes = await fetch(
      `${API_URL}/api/pages?locale=${locale}&populate=*`
    );
    const pages = await pagesRes.json();

    const router = genre.split("-");
    let filterValue = "";
    if (router[2]) {
      filterValue = router[1] + "-" + router[2];
    } else if (router[3]) {
      filterValue = router[1] + "-" + router[2] + "-" + router[3];
    } else {
      filterValue = router[1];
    }

    let products;
    if (router[0] === "new" && router[1] === "products") {
      const data = await fetch(
        `${API_URL}/api/products?/api/products?locale=${locale}&sort=publishedAt:desc&populate=*&pagination[limit]=30`
      );
      products = await data.json();
    } else if (router[0] === "sales" && router[1] === "products") {
      const data = await fetch(
        `${API_URL}/api/products?locale=${locale}&filters[offer][$gt]=0&sort=offer:desc&populate=*&pagination[limit]=30`
      );
      products = await data.json();
    } else if (router[0] === "popular" && router[1] === "products") {
      const data = await fetch(
        `${API_URL}/api/products?locale=${locale}&filters[rate][$gt]=0&sort=rate:desc&populate=*&pagination[limit]=30`
      );
      products = await data.json();
    } else if (router[0] === "new") {
      const currentMonth = new Date().getMonth();
      const lastMounth = currentMonth + 1;
      const data = await fetch(
        `${API_URL}/api/products?locale=${locale}&sort=publishedAt:desc&filters[category][slug][$eq]=${filterValue}&populate=*&pagination[limit]=30`
      );
      products = await data.json();
    } else if (router[0] === "sales") {
      const data = await fetch(
        `${API_URL}/api/products?locale=${locale}&filters[offer][$gt]=0&sort=offer:desc&filters[category][slug][$eq]=${filterValue}&populate=*&pagination[limit]=30`
      );
      products = await data.json();
    } else if (router[0] === "popular") {
      const data = await fetch(
        `${API_URL}/api/products?locale=${locale}&filters[rate][$gte]=1&sort=rate:desc&filters[category][slug][$eq]=${filterValue}&populate=*&pagination[limit]=30`
      );
      products = await data.json();
    } else if (router[0] === "all") {
      const data = await fetch(
        `${API_URL}/api/products?locale=${locale}&filters[category][slug][$eq]=${filterValue}&populate=*`
      );
      products = await data.json();
    } else if (router[0] === "related") {
      const data = await fetch(
        `${API_URL}/api/products?locale=${locale}&filters[category][slug][$eq]=${filterValue}&populate=*`
      );
      products = await data.json();
    } else if (router[0] === "category" || router[0] === "collections") {
      const data = await fetch(
        `${API_URL}/api/products?locale=${locale}&filters[${router[0]}][slug][$eq]=${filterValue}&populate=*`
      );
      products = await data.json();
    } else {
      const data = await fetch(
        `${API_URL}/api/products?locale=${locale}&populate=*`
      );
      products = await data.json();
    }

    return {
      props: {
        products: products.data,
        pages: pages.data,
        randumImg: ramdumImg.data,
        errMsg: false,
        ...(await serverSideTranslations(locale, ["common", "product"])),
      },
    };
  } catch (err) {
    return {
      props: {
        errMsg: true,
      },
    };
  }
}

export default Products;
