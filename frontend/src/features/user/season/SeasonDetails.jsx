import React from 'react'
import TournamentCard from './seasonui/TournamentCard'


const SeasonDetails = () => {
  return (
    <div  className='min-h-screen w-full bg-black sm:bg-[#181B20] flex sm:px-20'>
         
        <div className='flex flex-col w-full'>
         

         <section className='sm:px-20 px-6  py-3 sm:py-6'>
              
                <h5 className='text-3xl sm:text-5xl font-semibold'>Enter the <span className='text-purple-500'>Arena</span></h5>
                <p className='text-gray-400  hidden sm:flex text-xs sm:text-[13px] max-w-xl'>Make sure to follow the guidelines while submitting your work. Each participant is allowed to submit according to the rules defined for this season. Submissions that do not meet the requirements may be rejected by the administrators.</p>
         
         </section>
       

            <TournamentCard/>

        </div>

        
        </div>
  )
}

export default SeasonDetails