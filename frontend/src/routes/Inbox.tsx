import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Inbox')({
  component: RouteComponent,
})

function RouteComponent() {}
