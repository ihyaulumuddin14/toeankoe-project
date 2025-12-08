import MainNavbar from '../MainNavbar'
import { Outlet } from 'react-router-dom'

export default function CommonLayout() {
  return (
    <section>
      <MainNavbar />
      <Outlet />
    </section>
  )
}
