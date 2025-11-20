import React, { useContext } from 'react'
import ComponentHeader from './ComponentHeader'
import CatergoryCard from './CatergoryCard'
import { Context } from '../context/ContextProvider'

const PreferencesComponent = ({cats}) => {

  const {prefernces, setPreferences} = useContext(Context)


  const handlePreference = (cat) => {
    setPreferences(prev => [...prev, cat])

    const repeated = prefernces.filter((a) => a === cat);
    

    if (repeated.includes(cat)) {
      setPreferences(prefernces.filter(a => a !== cat))
    }
    
  }
  return (
    <div className="flex flex-col w-full pb-[24px] gap-[30px] border-b border-b-[#522614]/20  ">
        <ComponentHeader topic={`Preferences`} subtopic={`Select your preferences for a more personalized recommendation`} />

        <div className='flex gap-[16px]'>
            {
                cats.map((c, i) => (
                    <CatergoryCard  handleAddCat={handlePreference} key={i} cat={c}/>
                ))
            }

         
        </div>
    </div>
  )
}

export default PreferencesComponent