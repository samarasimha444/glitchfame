import React from 'react'

import { dashCards } from '../../../lib/admin'
import AdminCard from './components/AdminCard'
import SeasonsTable from './components/SeasonTable'


const AdminDashboard = () => {

  const token = localStorage.getItem("token");
console.log("TOKEN:", token);

  return (
    <div className='flex flex-col w-full h-screen '>


     <section className='flex flex-col  space-y-6 w-full h-full px-6'>
      <AdminCard type="home" cardsInfo={dashCards} />
      <SeasonsTable/>

     </section>



    </div>
  )
}

export default AdminDashboard