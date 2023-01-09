import client from "../../../lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import axios from "axios";
import { API_URL } from "../../../utils/connectionConfig";

/**
 *     const orderData = order?.attributes.products?.data.map((item) => ({
      id:item.id,
      name:item.attributes.name,
      price: item.attributes.offer > 0
      ? item.attributes.offer
      : item.attributes.price,
      quantity:1,
      currency_code: "USD",
      texCost:order?.attributes.texCost ,
 * 
*/
export default async function handle(req, res) {
  const { orderId } = req.body;
  if ((orderId, req.method === "POST")) {
    let order = null;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/orders/${orderId}?populate[orderProducts][populate][product][populate]=*`
      );
      console.log("orderRes", data.data);
      //rdeuce all prices(product prices  + tax+shipping price) in total price
      const total = data?.data?.attributes.orderProducts?.data.reduce(
        (sum, item) => {
          //check number of stock is greater than 0
          if (item.attributes.product.data.attributes.numberInStock > 0) {
            const quantity = parseInt(item.attributes.quantity);

            const price =
              item.attributes.product.data.attributes.offer > 0
                ? item.attributes.product.data.attributes.offer * quantity
                : item.attributes.product.data.attributes.price * quantity;
            return sum + parseFloat(price);
          } else {
            return sum;
          }
        },
        0
      );
      const totalCost =
        total +
        data?.data?.attributes.shippingCost +
        data?.data?.attributes.texCost;

      //create purchase_units
      order = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalCost,
              breakdown: {
                item_total: { value: total, currency_code: "USD" },
                tax_total: {
                  value: data?.data?.attributes.texCost,
                  currency_code: "USD",
                },
                shipping_total: {
                  value: data?.data?.attributes.shippingCost,
                  currency_code: "USD",
                },
              },
            },
            items: data?.data?.attributes.orderProducts?.data.map((item) => ({
              name: item.attributes.product.data.attributes.name,
              unit_amount: {
                value:
                  item.attributes.product.data.attributes.offer > 0
                    ? parseInt(item.attributes.product.data.attributes.offer) *
                      parseInt(item.attributes.quantity)
                    : parseInt(item.attributes.product.data.attributes.price) *
                      parseInt(item.attributes.quantity),
                currency_code: "USD",
              },
              quantity: 1,
              sku: "haf001",
            })),
          },
        ],
      };
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
    try {
      if (order) {
        const PaypalClient = client();
        const request = new paypal.orders.OrdersCreateRequest();
        request.headers["prefer"] = "return=representation";
        request.requestBody(order);
        console.log("request", request);
        const response = await PaypalClient.execute(request);
        const orderID = response;
        res.status(201).json({ orderID: orderID.result.id });
      } else {
        res.json({ message: "thair is no order" });
      }
    } catch (err) {
      res.json(err.message);
    }
  } else {
    res
      .status(500)
      .json({ message: "request method is not allowed or order data is null" });
  }
}
