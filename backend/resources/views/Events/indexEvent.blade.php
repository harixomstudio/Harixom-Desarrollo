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
                        @foreach( ['Events'] as $event)
                        <tr class="bg-stone-800 cursor-pointer user-row">
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $event }}</td>
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
        <form action="{{ route('updateEvent') }}" >
            @csrf
            <button class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-pink-400 to-blue-400 hover:scale-110 transform duration-300">
                Update Event
            </button>
        </form>

        <!-- Delete  -->
        <form id="disableForm" action="" method="POST">
            @csrf
            <input type="hidden" name="event_id" id="disableEventId">
            <button type="submit" class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-red-500 to-pink-400 hover:scale-110 transform duration-300">
                Delete Event
            </button>
        </form>
    </div>
</body>

</html>