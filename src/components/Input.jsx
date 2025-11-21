import { EyeClosed, EyeIcon } from 'lucide-react'
import React, { useState } from 'react'

const Input = ({placeholder, secure, type}) => {
    const [hide, setHide] = useState(true)
  return (
    <div className='flex items-center w-full px-[26px] max-h-[56px] py-[18px] border border-[#522614] rounded-xl'>
        <input type={secure && hide ? `password` : type} placeholder={placeholder} className='outline-0 h-full w-full text-[#522614] ' />

        <button onClick={() => setHide(h => !h)}>

        {
            secure && (
                hide ? (<EyeIcon className='text-[#522614] ml-auto' size={24}/>) 
                : (<EyeClosed className='text-[#522614] ml-auto' size={24}/>)
                
                
            )
        }
        </button>
    </div>
  )
}

export default Input