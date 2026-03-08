import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './AllRoutes/MainRoutes'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground flex w-full">
          <MainRoutes />
          <Toaster position="top-center" />
        </div>
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
