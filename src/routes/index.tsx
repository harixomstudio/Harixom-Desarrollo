<<<<<<< HEAD
import { createFileRoute } from "@tanstack/react-router";
import Home from "../components/pages/Index";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return (
    <Home
      subtitle="Welcome to"
      title="HARIXOM"
    />
  );
=======
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="flex flex-col items-center justify-center h-screen gap-4">
    <Link to="/Login" className='text-blue-500 text-4xl '>login</Link>
  </div>
>>>>>>> ee27dbae5edeb064fd96b9823f1c92f91d4af574
}
