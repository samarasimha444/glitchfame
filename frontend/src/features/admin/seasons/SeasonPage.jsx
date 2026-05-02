import React, { useState } from 'react'
import AdminCard from '../dashboard/components/AdminCard'
import Approval from './components/Approval'
import UserTable from './components/UserTable'
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
  
 

 
  <section className="flex-1 max-w-4xl w-full">
    <AdminCard stats={stats} cardsInfo={seasonCards} />
    <p className="text-gray-300 text-sm leading-relaxed">
  Once accepted, a contestant cannot be rejected. Admins can accept, reject, delete, or edit details.
</p>
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
    
   
     <UserTable setLive={setLive} type="initial" className="max-w-screen"/>
       

      </aside>

     </section>

    </div>
  )
}

export default SeasonPage