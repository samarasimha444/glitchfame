import React from 'react'
import AdminCard from '../dashboard/components/AdminCard'
import Approval from './components/Approval'
import ParticipantsTable from './components/UserTable'
import { dashCards } from '../../../constants/admin'

const SeasonPage = () => {
  return (
    <div className='flex min-h-screen'>
    <section className='flex flex-col space-y-6 w-full h-full md:px-6'>
      
      <AdminCard cardsInfo={dashCards}/>
      
      <aside className='flex flex-col w-full  max-w-screen '>
       
       <Approval className="max-w-screen"/>
    
      <h5></h5>
     <ParticipantsTable type="initial" className="max-w-screen"/>
       

      </aside>

     </section>

    </div>
  )
}

export default SeasonPage