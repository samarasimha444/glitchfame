import React from 'react'
import TournamentCard from './seasonui/TournamentCard'


const SeasonDetails = () => {
  return (
    <div  className='min-h-screen pt-24 w-full  flex sm:px-20'>
         
        <div className='flex flex-col w-full'>
         

         <section className='sm:px-20 px-6  py-3 sm:py-6'>
              
                <h5 className='home-h2'>Enter the <span className='text-primary'>Arena</span></h5>
                <p className='text-[13px] mb-4 sm:text-base text-gray-400 leading-relaxed max-w-xl hidden sm:flex'>Make sure to follow the guidelines while submitting your work. Each participant is allowed to submit according to the rules defined for this season. Submissions that do not meet the requirements may be rejected by the administrators.</p>
         
         </section>
       

            <TournamentCard/>

        </div>

        
        </div>
  )
}

export default SeasonDetails