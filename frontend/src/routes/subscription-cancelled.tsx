import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/subscription-cancelled')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-900 text-white p-6">
      <h1 className="text-4xl font-bold text-red-400 mb-4">Suscripción cancelada ❌</h1>
      <p className="text-lg text-gray-300 max-w-md text-center mb-6">
        Parece que has cancelado el proceso de suscripción. Si cambias de opinión,
        siempre puedes volver a activarla para disfrutar de las ventajas premium.
      </p>
      <a
        href="/"
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Volver al inicio
      </a>
    </div>
  );
}

export default RouteComponent;
