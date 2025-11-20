import React, { useContext, useState } from 'react'
import {Check} from 'lucide-react'
import { Context } from '../context/ContextProvider'
const CatergoryCard = ({cat, handleAddCat}) => {
  const {favGenres, setFavGenres} = useContext(Context)
  const {prefernces, setPreferences} = useContext(Context)


  
   
  return (
    <div className='flex items-center cursor-pointer justify-center w-max gap-[8px]'>
        <div onClick={() => handleAddCat(cat)} className='w-[20px] h-[20px] bg-[#EDCABB] border border-[#522614] 
        rounded-md'>
           {
             favGenres.includes(cat) && <Check size={18}/>
           }
           {
             prefernces.includes(cat) && <Check size={18}/>
           }
        </div>
            <p onClick={() => handleAddCat(cat)} className='text-[#522614]'>{cat}</p>
    </div>
  )
}

export default CatergoryCard