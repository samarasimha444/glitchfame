import React, { useMemo } from 'react'
import { dashCards } from '../../../constants/admin'
import AdminCard from './components/AdminCard'
import SeasonsTable from './components/SeasonTable'
import { useFetchSeasons } from './hooks'


const AdminDashboard = () => {

  const { data, isLoading, } = useFetchSeasons();
    console.log(data);
    
const seasons = data?.content || [];
console.log(seasons)



const stats = useMemo(() => {
  return seasons.reduce(
    (acc, season) => {
      acc.totalSeasons += 1;

     
      const prize = season.prizeMoney
        ? Number(season.prizeMoney.replace(/[^0-9]/g, ""))
        : 0;
      acc.totalPrizeMoney += prize;

      
      if (season.seasonLock) acc.totalLocked += 1;

      return acc;
    },
    {
      totalSeasons: 0,
      totalPrizeMoney: 0,
      totalLocked: 0,
    }
  );
}, [seasons]);


 


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