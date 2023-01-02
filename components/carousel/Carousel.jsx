import React, { useEffect, useRef, useState } from 'react'
import {motion} from 'framer-motion';
import {BsArrowLeft,BsArrowRight} from "react-icons/bs"
import Link from 'next/link';
import ProductCard from '../product/ProductCard';
import dynamic from 'next/dynamic';


 function Carousel({type,title,products}) {

   // const [width,setWidth]=useState(0);
    const [movedis,setMoveDis]=useState(0);
    const [numItems,setSetNumItems]=useState(0);
    const [route,setRoute]=useState(null);

    const carousel=useRef();
    const carouselItem=useRef();


  useEffect(()=>{
    if(type==="new"||type==="sales"||type==="popular"){
     setRoute(`${type}-products`)
    }else if(type==="related"||type==="recentViewed"){
     setRoute(`all-${(products.length>0)&&(products[0].attributes?products[0].attributes.genre:products[0].genre)}`)
    }
 },[type,products,route])

    const handleLeft=()=>{
        if(products.length>4&&numItems>=0&&numItems<(products.length-4)){
            setMoveDis(movedis+carouselItem.current.offsetWidth)
            setSetNumItems(numItems+1)
        }
    }
    const handleRight=()=>{
        if(products.length>4&&numItems>0){
        setMoveDis(movedis-carouselItem.current.offsetWidth)
        setSetNumItems(numItems-1)
    }
}
  return (
    <div  className=' my-4 container mx-auto'>
        <div className="my-4 flex justify-center">
          <div className=''>
            <div className="text-center w-full my-4">
              <div className="capitalize text-3xl ">{title?title:""}</div>
              <Link href={`/products/${route}`}>
                <a className="text-secondary text-lg my-4 capitalize">view All</a>
              </Link>
            </div>
          </div>
           
        </div>
      <motion.div ref={carousel} className=" overflow-hidden relative">
      {
            products.length>4&&<div onClick={()=>handleLeft()} className="absolute top-1/2 left-0 z-10 cursor-pointer">
             <BsArrowLeft className='text-secondary text-4xl'/>
          </div>
          }
          {
          products.length>4&&<div onClick={()=>handleRight()} className="absolute top-1/2 right-0 z-10 cursor-pointer">
             <BsArrowRight className='text-secondary text-4xl'/>
          </div>
          }
         <motion.div animate={{x:-movedis}} transition={{duration:0.5,type:"tween"}} className='flex'>
        
          {products&&products.map((product,index)=>(
              <div key={index} ref={carouselItem} className="md:w-1/4 w-full">
                <ProductCard key={product.id}  product={product.attributes?product.attributes:product}/>
              </div>
            ))}
         </motion.div>
      </motion.div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Carousel), { ssr: false });