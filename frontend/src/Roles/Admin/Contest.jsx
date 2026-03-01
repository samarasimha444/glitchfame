import React from 'react'
import AdminCards from './ui/AdminCards'
import ParticipantsApproval from './ui/ParticipantsApproval'
import ParticipantUser from './ui/ParticipantUser'
import { dashCards } from '../../lib/admin'

const Contest = () => {
  return (
    <div className='flex min-h-screen'>
    <section className='flex flex-col  space-y-6 w-full h-full px-6'>
      <AdminCards cardsInfo={dashCards}/>
      
      <aside className='flex flex-col w-full  max-w-screen '>
       
     <ParticipantsApproval className="max-w-screen"/>
    
      <h5></h5>
     <ParticipantUser type="initial" className="max-w-screen"/>
       

      </aside>

     </section>

    </div>
  )
}

export default Contest