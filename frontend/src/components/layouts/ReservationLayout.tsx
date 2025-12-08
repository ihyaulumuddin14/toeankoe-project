import SimpleNavbar from '../SimpleNavbar'
import { Outlet, useLocation } from 'react-router-dom'

export default function ReservationLayout() {
  const location = useLocation().pathname.split("/");
  const title = location[location.length - 1].split("-").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");

  return (
    <section>
      <SimpleNavbar title={title}/>
      <Outlet />
    </section>
  )
}
