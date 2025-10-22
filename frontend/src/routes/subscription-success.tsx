import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/subscription-success')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-900 text-white p-6">
      <h1 className="text-4xl font-bold text-green-400 mb-4">¡Suscripción exitosa!</h1>

      <p className="text-lg text-gray-300 max-w-md text-center mb-6">
        Tu suscripción premium se ha activado correctamente. Ahora tienes acceso exclusivo
        a funciones avanzadas como la creación de talleres y eventos.
      </p>
      <a
        href="/Profile"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Volver al perfil

      </a>
    </div>
  );
}

export default RouteComponent;
