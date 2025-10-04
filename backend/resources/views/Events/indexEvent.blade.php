<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Eventos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Starstruck&display=swap" rel="stylesheet">
</head>

<body class="bg-stone-950 min-h-screen p-8">

    <!-- Título principal -->
    <div class="mb-8 pl-4">
        <h2 class="text-2xl font-bold" style="color:#ec4899; font-family: 'Starstruck', cursive;">
            Registro De Eventos
        </h2>
    </div>

    <!-- Card contenedor -->
    <div class="w-full max-w-6xl mx-auto bg-stone-900 rounded-lg p-0 relative flex flex-col items-center shadow-lg">

        <!-- Tabla -->
        <div class="w-full mt-10 px-10 pb-10 flex flex-col items-center">
            <div class="w-full rounded-t-lg overflow-hidden shadow-lg">
                <div class="bg-stone-900 text-center py-2">
                    <h1 class="text-gray-300 font-semibold">Eventos Registrados</h1>
                </div>

                <table class="w-full border-collapse rounded-b-lg overflow-hidden">
                    <thead>
                        <tr class="bg-stone-900">
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">#</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Image</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Type</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Launch Date</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Start Time</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Title</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Description</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Finish Date</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">End Time</th>
                        </tr>
                    </thead>
                    <tbody>
    @foreach($events as $index => $event)
    <tr class="bg-stone-800 cursor-pointer event-row" data-event-id="{{ $event->id }}">
        <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $index + 1 }}</td>
        <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center"><img src="{{ asset('storage/' . $event->image) }}" alt="{{ $event->title }}"></td>
        <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event->type }}</td>
        <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event->dateStart }}</td>
        <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event->timeStart }}</td>
        <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event->title }}</td>
        <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event->description }}</td>
        <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event->dateEnd }}</td>
        <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event->timeEnd }}</td>
    </tr>
    @endforeach
</tbody>
                </table>
            </div>
        </div>
    </div>

    
    <div class="w-full max-w-4xl mx-auto flex justify-between mt-12 px-2">
        <!-- Create  -->
        <a href="{{ route('createEvent') }}" 
   class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-teal-300 to-green-300 hover:scale-110 transform duration-300 border-2 border-teal-300">
   Create Event
</a>
        

        <!-- Update  -->
         <a id="updateBtn"
   href="#"
   class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-pink-400 to-blue-400 hover:scale-110 transform duration-300">
   Update Event
</a>

        <!-- Delete  -->
        <form id="disableForm" action="{{ route('deleteEvent') }}" method="POST">
    @csrf
    <input type="hidden" name="event_id" id="disableEventId"> 
    <button type="button" id="deleteBtn"
        class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-red-500 to-pink-400 hover:scale-110 transform duration-300 opacity-50 pointer-events-none">
        Delete Event
    </button>
</form>

<!-- Back -->
<a href="{{ route('admin.index') }}"
   class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-yellow-300 to-orange-400 hover:scale-110 transform duration-300 border-2 border-yellow-400">
   Back to Admin
</a>

<!-- Modal de confirmación -->
<div id="confirmModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">¿Estás seguro?</h2>
        <p class="text-gray-600 mb-6">Esta acción eliminará el evento seleccionado y no se puede deshacer.</p>
        <div class="flex justify-around">
            <button id="cancelDelete"
                class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold">
                Cancelar
            </button>
            <button id="confirmDelete"
                class="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold">
                Confirmar
            </button>
        </div>
    </div>
</div>

</body>

<script>
let selectedEventId = null;
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');
const disableForm = document.getElementById('disableForm');

// Modal elementos
const confirmModal = document.getElementById('confirmModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

document.querySelectorAll('.event-row').forEach(row => {
    row.addEventListener('click', function() {
        selectedEventId = this.dataset.eventId;

        // remarcar fila
        document.querySelectorAll('.event-row').forEach(r => r.classList.remove('bg-stone-600'));
        this.classList.add('bg-stone-600');

        // activar enlace
        updateBtn.href = "/updateEvent/" + selectedEventId;
        updateBtn.classList.remove('opacity-50', 'pointer-events-none');

        deleteBtn.classList.remove('opacity-50', 'pointer-events-none');
        document.getElementById('disableEventId').value = selectedEventId;
    });

    deleteBtn.addEventListener('click', () => {
    if (selectedEventId) {
        confirmModal.classList.remove('hidden');
    }
});

// cancelar
cancelDelete.addEventListener('click', () => {
    confirmModal.classList.add('hidden');
});

// confirmar
confirmDelete.addEventListener('click', () => {
    disableForm.submit();
});
});

// deshabilitar botón por defecto
updateBtn.classList.add('opacity-50', 'pointer-events-none');
deleteBtn.classList.add('opacity-50', 'pointer-events-none')
</script>
</html>