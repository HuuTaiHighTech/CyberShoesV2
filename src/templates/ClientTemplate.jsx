import { Outlet } from 'react-router-dom'
import Header from '../component/ui/header/Header'
import Footer from '../component/ui/footer/Footer'

const ClientTemplate = () => {
  return (
    <>
      <Header />
      <main className="container-fluid">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default ClientTemplate
