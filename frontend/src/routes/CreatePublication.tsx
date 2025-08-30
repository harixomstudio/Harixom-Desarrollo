import { createFileRoute } from '@tanstack/react-router'
import CreatePublicationPage from "../components/pages/CreatePublicationPage";

export const Route = createFileRoute('/CreatePublication')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <CreatePublicationPage
      title="Create Publication"
      description="Mi primera publicación"
      category="Art"
    />
}

  

