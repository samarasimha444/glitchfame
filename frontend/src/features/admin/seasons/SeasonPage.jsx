import React from 'react'
import AdminCard from '../dashboard/components/AdminCard'
import Approval from './components/Approval'
import ParticipantsTable from './components/UserTable'
import { seasonCards } from '../../../constants/admin'
import { useContestants } from './hook'

const SeasonPage = () => {

 const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useContestants();

  const contestants =
    data?.pages?.flatMap(p => p.content || []) || [];

    const stats = {
    pending: contestants.length,
  };




  return (
    <div className='flex min-h-screen'>
    <section className='flex flex-col space-y-6 w-full h-full md:px-6'>
      
      <AdminCard stats={stats} cardsInfo={seasonCards}/>
      
      <aside className='flex flex-col w-full  max-w-screen '>
       
       <Approval
        contestants={contestants}
        isLoading={isLoading}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    
   
     <ParticipantsTable type="initial" className="max-w-screen"/>
       

      </aside>

     </section>

    </div>
  )
}

export default SeasonPage