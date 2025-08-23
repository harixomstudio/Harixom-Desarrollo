import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



// Definición del router
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    // acá podés inyectar cosas globales como user/auth si querés
  },
})

// Necesario para que TS conozca el tipo de router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    {/* El router se encarga de renderizar las rutas */}
    <RouterProvider router={router} />
  </StrictMode>,
)
  