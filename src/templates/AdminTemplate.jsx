import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../component/ui/Sidebar'

const AdminTemplate = () => {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-3 bg-body-tertiary'>
            <Sidebar/>
        </div>
        <main className='col-9'>
            <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default AdminTemplate
