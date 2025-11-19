import React from 'react'

const CatergoryInput = ({cats}) => {
  return (
    <select className='w-full bg-white outline-0 border border-[#522614] rounded-[60px] py-[18px] px-[26px] text-[#522614]'>
        {
            cats.map((c, i) => (
                <option key={i}>{c}</option>
            ))
        }
    </select>
  )
}

export default CatergoryInput