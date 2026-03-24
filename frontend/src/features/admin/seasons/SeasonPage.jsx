import React, { useState } from 'react'
import AdminCard from '../dashboard/components/AdminCard'
import Approval from './components/Approval'
import ParticipantsTable from './components/UserTable'
import { seasonCards } from '../../../constants/admin'
import { useContestants } from './hook'

const SeasonPage = () => {
const [live,setLive ]=useState(false)

 const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useContestants();

  const contestants =
    data?.pages?.flatMap(p => p.content || []) || [];


const totalElements = data?.pages?.[0]?.totalElements ?? 0;

const stats = {
  pending: totalElements,
  live:live
};





  return (
    <div className='flex min-h-screen w-full max-w-screen'>
    <section className='flex flex-col space-y-6 w-full max-w-screen h-full md:px-6'>
     
   <div className="flex  justify-center items-center max-w-screen flex-col lg:flex-row gap-6 w-full">
  
 <section className="flex-1 hidden border md:flex md:flex-col border-gray-800 rounded-2xl p-4 shadow-sm overflow-y-auto">
  <h5 className="text-white font-semibold mb-3">CONTESTANTS ACTION</h5>
  <p className="text-gray-300 text-sm leading-relaxed">
    Once a contestant is <strong>accepted</strong>, they cant  be <strong>rejected</strong>  <strong></strong>, so please take all actions carefully. 
    Admin actions include: accepting, rejecting, or deleting contestants, as well as modifying their details if necessary. 
    Users can also <strong>vote</strong> or interact with contestants, so ensure all updates are accurate and verified before making changes. 
    Handle every action responsibly to maintain fairness and integrity in the system.
  </p>
</section>

 
  <section className="flex-1 w-full">
    <AdminCard stats={stats} cardsInfo={seasonCards} />
  </section>
</div>
      
      
      
      <aside className='flex flex-col w-full  max-w-screen '>
       
       <Approval
        contestants={contestants}
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    
   
     <ParticipantsTable setLive={setLive} type="initial" className="max-w-screen"/>
       

      </aside>

     </section>

    </div>
  )
}

export default SeasonPage