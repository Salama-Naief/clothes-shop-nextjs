/*import nc from "next-connect"

const hundler=nc();

hundler.get(async(req,res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID||"sb")
})

export default hundler;*/
export default async function handler(req, res) {
    res.status(200).json(process.env.PAYPAL_CLIENT_ID||"sb" )
  }