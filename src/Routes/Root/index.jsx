import { Navbar } from '../../components'
import { Outlet } from 'react-router-dom'

const Root = () => {
  return (
    <div className='root__route min-h-screen flex flex-col'>
        <Navbar />
        <Outlet />
    </div>
  )
}

export default Root