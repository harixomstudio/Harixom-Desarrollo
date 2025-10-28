import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/subscription-cancelled')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-900 text-white p-6">
      <h1 className="text-4xl font-bold text-red-400 mb-4">¡Suscription cancelled ❌</h1>
      <p className="text-lg text-gray-300 max-w-md text-center mb-6">
        Your subscription has been cancelled. If you change your mind,
        You can re-subscribe at any time to enjoy the premium benefits.
      </p>
      <a
        href="/Profile"
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Back to profile
      </a>
    </div>
  );
}

export default RouteComponent;
