import React from 'react'
import Cards from './home/Cards'
import TournamentCard from './home/TournamentCard'

const SeasonDetails = () => {
  return (
    <div  className='min-h-screen  flex px-20'>
         
        <div className='flex flex-col'>
         

         <section className='px-20 py-6'>
              
                <h5 className='text-5xl font-semibold'>Enter the <span className='text-purple-500'>Arena</span></h5>
                <p className='text-gray-400 text-[13px] max-w-xl'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic repudiandae ea quos itaque aliquid delectus iste, vel enim laborum. Maxime, nemo minima natus doloremque aspernatur praesentium quos id earum repudiandae!</p>
         
         </section>
       

            <TournamentCard/>

        </div>

        
        </div>
  )
}

export default SeasonDetails