import { LocalizationProvider } from '@mui/x-date-pickers'
import AppLayout from './components/AppLayout'
import AppRouter from './router'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ContextProvider from './contexts'

function App() {
  return (
    <div className="app">

      <ContextProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>

          <AppLayout>
            <AppRouter />
          </AppLayout>

        </LocalizationProvider>
      </ContextProvider>

    </div>
  )
}

export default App
