import './Home.css'
import { cardEvent } from '../../components/cardEvent/cardEvent'
import { loader } from '../../utils/loader/loader'

export const Home = async () => {
  const main = document.querySelector('main')

  loader(true)
  await cardEvent()
  loader(false)
}
