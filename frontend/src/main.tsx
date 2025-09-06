import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import { ToastProvider } from './components/ui/ToastContext'


// Definición del router
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    // acá podés inyectar cosas globales como user/auth si querés
  },
})

const queryClient = new QueryClient();

// Necesario para que TS conozca el tipo de router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}> 
    <ToastProvider>
      {/* El router se encarga de renderizar las rutas */}
      <RouterProvider router={router} />
    </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
  