
import dynamic from 'next/dynamic';
import CardBox from './CardBox'
 function BoxCollection({topCollection,bottomCollection}){
 
    return(
      <>
      {
         topCollection&&<div className={`grid md:grid-cols-3 container mx-auto`}>
         {
          topCollection.map((collection,index)=>(
            <div key={index} className='col-span-1'>
              <CardBox height="h-64 md:h-80" collection={collection.attributes}/>
            </div>
          ))
         }
         </div>
      }
        {
         bottomCollection&&<div className={`grid md:grid-cols-2 container mx-auto`}>
         {
          bottomCollection.map((collection,index)=>(
            <div key={index} className='col-span-1'>
              <CardBox height="h-80 md:h-96" collection={collection.attributes}/>
            </div>
          ))
         }
         </div>
      }
      </>
       
    )
}
export default dynamic(() => Promise.resolve(BoxCollection), { ssr: false });