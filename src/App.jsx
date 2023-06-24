import './App.css'
import MainComponent from './components/mainComponents'
import { AppProvider } from './state/provider'

function App() {

  return (
    <>
      <div className='text-xl'>
        Ticket booking App 🚅 ( UnStop * )
      </div>
      <AppProvider>
      <MainComponent />
      </AppProvider>
    </>
  )
}

export default App
