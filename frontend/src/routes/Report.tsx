import { createFileRoute } from '@tanstack/react-router'
import ReportPage from '../components/pages/ReportPage'

export const Route = createFileRoute('/Report')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ReportPage />;
}
