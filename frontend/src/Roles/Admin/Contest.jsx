import React from 'react'
import AdminCards from './ui/AdminCards'
import ParticipantsApproval from './ui/ParticipantsApproval'
import ParticipantUser from './ui/ParticipantUser'

const Contest = () => {
  return (
    <div className='flex min-h-screen'>
    <section className='flex flex-col  space-y-6 w-full h-full px-6'>
      <AdminCards/>
      
      <aside className='flex w-full justify-between max-w-screen '>
       
     <ParticipantsApproval className="max-w-3xl"/>
     
     <ParticipantUser className="max-w-[350px]"/>
       
    




      </aside>

     </section>

    </div>
  )
}

export default Contest