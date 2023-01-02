import client from "/lib/paypal";
import paypal from "@paypal/checkout-server-sdk";

export default async function handle(req, res) {
  //Capture order to complete payment
  const { orderID } = req.body;
  const PaypalClient = client();
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});
  const response = await PaypalClient.execute(request);
  if (!response) {
    res.status(500);
  }

  // Update payment to PAID status once completed
  /* await prisma.payment.updateMany({
    where: {
      orderID,
    },
    data: {
      status: 'PAID',
    },
  })*/
  res.json({ ...response.result });
}
