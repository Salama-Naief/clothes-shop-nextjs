import { useTranslation } from "next-i18next";


export default function ConenctionWithUs (){

     const {t}=useTranslation();

    const handleSubmit=(e)=>{
        e.preventDefault();
    }
    return(
        <div className="w-full font-serif text-gray-900 bg-gray-400 flex justify-center p-4">
            <div className="text-center">
                <div className="text-3xl my-4 capitalize">{t("common:Chate_with_us")}</div>
                <div className="my-2 text-sm md:text-base capitalize text-gray-700">{t("common:connect_details")}</div>
               <form action="flex items-center" onSubmit={handleSubmit}>
                   <input type="text" className="outline-none border border-primary bg-white py-2 px-4 text-gray-900 w-80 flex-grow" placeholder={t("common:message")} />
                   <button type="submit" className="mx-2 py-2 px-6 md:px-3 text-gray-900 bg-white border border-primary uppercase font-bold my-2 md:my-0">{t("common:send")}</button>
               </form>
               <div className="my-2 capitalize text-sm md:text-base text-gray-700"> {t("common:replay_with_24hour")}</div>
            </div>
        </div>
    )
}