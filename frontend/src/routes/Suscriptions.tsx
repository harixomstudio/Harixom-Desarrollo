import { createFileRoute } from '@tanstack/react-router'
import SuscriptionsPage from '../components/pages/SuscriptionsPage'

export const Route = createFileRoute('/Suscriptions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SuscriptionsPage />
}
