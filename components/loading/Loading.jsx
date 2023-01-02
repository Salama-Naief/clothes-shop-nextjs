import React,{CSSProperties} from 'react'
import ClipLoader from "react-spinners/ClipLoader";

const override=CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "D92D18",
  color:"D92D18",
  loading: true,
  CircleLoader:90,
  speedMultiplier: 1
};

export default function Loading() {
  return (
    <div className='text-3xl w-full h-screen flex justify-center items-center text-secondary'>
        <ClipLoader color='#99750E' cssOverride={override}  size={50} />
    </div>
  )
}
