import { createFileRoute } from '@tanstack/react-router'
import DataSuscriptionPage from '../components/pages/DataSubscriptionPage'

export const Route = createFileRoute('/DataSubscription')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DataSuscriptionPage />
}