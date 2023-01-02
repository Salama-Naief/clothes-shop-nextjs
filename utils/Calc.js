
export const Offer=(price,offer)=>{
  if(!offer===0||offer===undefined){
    return null
  }
  return Math.trunc(100-(offer/price)*100);
}