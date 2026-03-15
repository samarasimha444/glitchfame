import React, { useMemo } from 'react'
import { dashCards } from '../../../constants/admin'
import AdminCard from './components/AdminCard'
import SeasonsTable from './components/SeasonTable'
import { useFetchSeasons } from './hooks'


const AdminDashboard = () => {

  const { data, isLoading, isError, error } = useFetchSeasons();
    console.log(data);
    
const seasons = data?.content || [];


const stats = useMemo(() => {
  return seasons.reduce(
    (acc, season) => {
      acc.totalSeasons += 1;
      acc.totalPrizeMoney += season.prizeMoney || 0;

      if (season.voteLock) acc.votingLocked += 1;
      if (season.participationLock) acc.participationLocked += 1;

      return acc;
    },
    {
      totalSeasons: 0,
      totalPrizeMoney: 0,
      votingLocked: 0,
      participationLocked: 0,
    }
  );
}, [seasons]);

  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);

  return (
    <div className='flex flex-col w-full h-screen '>


     <section className='flex flex-col   space-y-6 w-full h-full sm:px-6'>
      <AdminCard title="Manage Seasons" paragraph="Note here basics details of all the Season" type="home" cardsInfo={dashCards} stats={stats} />
      <SeasonsTable isLoading={isLoading} seasons={data}/>

     </section>



    </div>
  )
}

export default AdminDashboard