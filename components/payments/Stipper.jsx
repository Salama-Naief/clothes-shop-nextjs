import React, { useContext } from 'react'
import { Store } from '../../utils/Store'
import {MdCheck} from "react-icons/md"
import { useTranslation } from 'next-i18next';
export default function Stipper() {
    const {state}=useContext(Store);
    const {user,cart:{shipping,paymanetMethod,orderComplete}}=state
    const {t} =useTranslation();
  return (
    <div className='my-4 flex items-center'>
        <div className="flex items-center px-1">
            <div className='flex flex-col items-center justify-center'>
                <div className={`flex items-center justify-center w-fit ${state.user?"bg-secondary p-1":"bg-gray-400 px-2"} text-white rounded-full text-xl`}>{user?<MdCheck className='text-xl text-white'/>:"1"}</div>
                <div className='mx-1 text-gray-400'>{t("common:login")}</div>
            </div>   
        </div>
         <div className={`flex-1 h-0.5 w-fit ${state.user?"bg-secondary":"bg-gray-400"} w-full`}></div>
        <div className="flex items-center px-1">
            <div className='flex flex-col items-center justify-center'>
                <div className={`flex items-center justify-center w-fit ${shipping?"bg-secondary p-1":"bg-gray-400 px-2"} text-white rounded-full text-xl`}>{shipping!=={}?<MdCheck className='text-xl text-white'/>:"2"}</div>
                <div className='mx-1 text-gray-400'>{t("common:shipping")}</div>
            </div>        
        </div>
        <div className={`flex-1 h-0.5 ${shipping?"bg-secondary":"bg-gray-400"} w-full`}></div>
        <div className="flex items-center px-1">
            <div className='flex flex-col items-center justify-center'>
                <div className={`flex items-center justify-center w-fit ${paymanetMethod?"bg-secondary p-1":"bg-gray-400 px-2"} text-white rounded-full text-xl`}>{paymanetMethod?<MdCheck className='text-xl text-white'/>:"3"}</div>
                <div className='mx-1 text-gray-400'>{t("common:payment")}</div>
            </div>
        </div>
        <div className={`flex-1 w-fit h-0.5 ${paymanetMethod?"bg-secondary":"bg-gray-400"} w-full`}></div>
        <div className="flex items-center px-1">
            <div className='flex flex-col items-center justify-center'>
                <div className={`flex items-center justify-center w-fit ${orderComplete?"bg-secondary p-1":"bg-gray-400 px-2"} text-white rounded-full text-xl`}>{orderComplete?<MdCheck className='text-xl text-white'/>:"4"}</div>
                <div className='mx-1 text-gray-400'>{t("common:order")}</div>
            </div>
        </div>
    </div>
  )
}
