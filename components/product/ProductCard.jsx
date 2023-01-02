import { useContext, useState } from "react";
import Link from "next/link";
import ProductSliders from "./ProductSliders";
import { Offer } from "../../utils/Calc";
import { Store } from "../../utils/Store";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
function ProductCard({ product, porductId }) {
  const { state, dispatch } = useContext(Store);
  const [productHover, setProductHover] = useState(false);
  const { i18n } = useTranslation();
  const newItem =
    new Date().getMonth() - new Date(product.createdAt).getMonth();
  const handleViewedCart = () => {};
  return (
    <div
      className={``}
      style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
    >
      {!product ? (
        <div className="bg-gray-100 h-80  flex justify-center items-center border border-gray-400">
          <div className="text-secondary">Looding..</div>
        </div>
      ) : (
        <div
          onClick={() => handleViewedCart()}
          className="relative h-fit border mx-1 md:mx-4 font-serif"
          onMouseEnter={() => setProductHover(true)}
          onMouseLeave={() => setProductHover(false)}
        >
          <ProductSliders
            productHover={productHover}
            porductId={porductId}
            product={product}
          />
          <div className="px-4">
            <div className="absolute left-1 top-1">
              {product.offer !== 0 && (
                <div className=" bg-secondary  rounded  text-sm md:text-base px-1 md:px-2  md:py-0.5  text-white">
                  -{Offer(product.price, product.offer)}%
                </div>
              )}
              <div
                className={`${
                  newItem >= -1 ? "bg-primary" : "bg-gray-900"
                } text-sm md:text-base   my-1 rounded px-1 md:px-2 md:py-0.5  text-white`}
              >
                {newItem >= -1 ? "new" : "bundle"}
              </div>
            </div>
            <Link href={`/product/${product.slug}`}>
              <a>
                <div className="py-2"> {product.smDisc}</div>
                <div className=" flex justify-between">
                  <div
                    className={`font-medium md:font-bold pb-2 ${
                      product.offer === 0
                        ? "text-gray-900"
                        : "text-gray-500 line-through"
                    }`}
                  >
                    $ {product.price}
                  </div>
                  {product.offer !== 0 && (
                    <div className="font-medium md:font-bold pb-2 text-secondary">
                      {" "}
                      ${product.offer}
                    </div>
                  )}
                </div>
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
