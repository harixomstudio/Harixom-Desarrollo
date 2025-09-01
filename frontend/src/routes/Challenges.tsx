import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/Challenges')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <div className='flex justify-center items-center flex-col h-full'>
      <h1 className='text-4xl font-bold text-red-500'>HOLA EVELYN</h1>
      <h2 className='gap-3 text-2xl font-semibold text-gray-700'>Que te vaya bien con esto</h2>
    </div>
  )
}
