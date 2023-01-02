import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import Stipper from "../components/payments/Stipper";
import { API_URL } from "../utils/connectionConfig";
import { Store } from "../utils/Store";
export default function Cart() {
  const { state } = useContext(Store);
  const router = useRouter();
  const {
    cart: { cartItems },
  } = state;

  return (
    <div className="container mx-auto px-2 my-10">
      <h1 className="text-2xl md:text-3xl my-4 font-bold w-full text-center">
        Cart
      </h1>

      <div className="grid md:grid-cols-4">
        <table className="table-auto text-left w-full shadow my-4 px-4">
          <thead className="border-b border-gray-400">
            <tr className="">
              <th className="py-4">Name</th>
              <th>Color</th>
              <th>Size</th>
              <th>Amount</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems?.map((item, index) => (
              <tr key={index} className="border-b border-gray-400">
                <td className="py-2">
                  <Link href={`/product/${item.slug}`}>
                    <a>
                      <div className="flex items-center h-20 w-16">
                        <Image
                          src={item.productImg.data[0].attributes.url}
                          loading="eager"
                          layout="fill"
                          objectFit="contain"
                          objectPosition={"center"}
                          alt={item.productImg.data[0].attributes.name}
                        />
                        <div className="mx-2 capitalize">{item.name}</div>
                      </div>
                    </a>
                  </Link>
                </td>
                <td>{item.color}</td>
                <td>{item.size}</td>
                <td className="text-gray-400 line-through">${item.price}</td>
                <td className="text-secondary">
                  ${item.offer ? item.offer : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:col-span-1 shadow-md  px-4 mx-4">
        <div className="flex justify-between my-4">
          <div className="font-semibold">Items</div>
          <div className="">({numItems})tems</div>
        </div>
        <div className="flex justify-between my-4">
          <div className="font-semibold">price</div>
          <div className="">${price}</div>
        </div>
        <div className="flex justify-between my-4">
          <div className="font-semibold">Tax</div>
          <div className="">${taxCost}</div>
        </div>
        <div className="flex justify-between my-4">
          <div className="font-semibold">Shipping</div>
          <div className="">${shippingCost}</div>
        </div>
        <div className="flex justify-between my-4">
          <div className="font-semibold">TotalCost</div>
          <div className="text-secondary">${totalCost}</div>
        </div>
        <button className="w-full bg-primary text-white uppercase my-4 py-2">
          Payment
        </button>
        <Link href={`/payment`} passHref>
          <a>
            <div className="w-full text-center bg-gray-50 text-gray-900 uppercase  py-2 border border-secondary">
              back
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
}
