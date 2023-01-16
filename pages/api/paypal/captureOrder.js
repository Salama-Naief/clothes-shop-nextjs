import client from "../../../lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import axios from "axios";
import { API_URL } from "../../../utils/connectionConfig";

export default async function handle(req, res) {
  //Capture order to complete payment
  const { orderID } = req.body;
  console.log("orderID capture", orderID);
  if (req.method === "POST") {
    try {
      const PaypalClient = client();
      const request = new paypal.orders.OrdersCaptureRequest(orderID);
      request.requestBody({});

      const response = await PaypalClient.execute(request);
      console.log("response capture", response);
      if (!response) {
        res.status(500);
      }

      console.log("capture", response.result);
     
      res.json({ ...response.result });
    } catch (error) {
      res.json({ errMsg: error.message });
    }
  } else {
    res.status(500).json({ message: "request method is not allowed" });
  }
}
