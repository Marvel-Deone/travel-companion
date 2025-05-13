import { LoadScript } from '@react-google-maps/api'
import './App.css'
import Header from './components/Header'

function App() {

  return (
    <>
      {/* <CSSBas */}
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLEMAP_API_KEY} libraries={['places']}>
        <Header />
      </LoadScript>
    </>
  )
}

export default App
