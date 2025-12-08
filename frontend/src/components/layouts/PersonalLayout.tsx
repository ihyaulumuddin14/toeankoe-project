import SimpleNavbar from '../SimpleNavbar'
import MainNavbar from '../MainNavbar';
import { useWindowWidth } from '@/hooks/useWindowWidth'
import { Outlet, useLocation } from 'react-router-dom'

export default function PersonalLayout() {
  const width = useWindowWidth();
  const location = useLocation().pathname.split("/");
  let titleArray = location.slice(1).map(word => {
    if (/\d/.test(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  })

  if (/\d/.test(titleArray[titleArray.length - 1])) {
    for (let i = titleArray.length - 1; i > 0; i--) {
      titleArray[i] = titleArray[i - 1];
    }
    titleArray[0] = "Detail"
  }

  const title = titleArray.join(" ");

  return (
    <section>
      {width < 1024 ? <SimpleNavbar title={title} /> : <MainNavbar/>}
      <Outlet />
    </section>
  )
}
