import React from 'react'
import AdminCards from './ui/AdminCards'
import Table from './ui/Table'
import { dashCards } from '../../lib/admin'


const AdminDashboard = () => {
  return (
    <div className='flex flex-col w-full h-screen '>


     <section className='flex flex-col  space-y-6 w-full h-full px-6'>
      <AdminCards type="home" cardsInfo={dashCards} />
      <Table/>

     </section>



    </div>
  )
}

export default AdminDashboard