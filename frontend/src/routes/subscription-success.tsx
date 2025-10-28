import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/subscription-success')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-900 text-white p-6">
      <h1 className="text-4xl font-bold text-green-400 mb-4">¡Suscription successful!</h1>

      <p className="text-lg text-gray-300 max-w-md text-center mb-6">
        
        Your subscription has been successfully activated. Now you have access to advanced
        features such as creating workshops and events.
      </p>
      <a
        href="/Profile"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Back to profile
      </a>
    </div>
  );
}

export default RouteComponent;
