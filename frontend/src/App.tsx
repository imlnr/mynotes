import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './AllRoutes/MainRoutes'
import { Toaster } from 'sonner'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex w-full">
        <MainRoutes />
        <Toaster position="top-center" />
      </div>
    </BrowserRouter>
  )
}

export default App
