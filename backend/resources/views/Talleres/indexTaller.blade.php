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
        <h2 class="text-5xl font-bold" style="color:#ec4899; font-family: 'Starstruck', cursive;">
            Registro De Talleres
        </h2>
    </div>

    <!-- Card contenedor -->
    <div class="w-full max-w-6xl mx-auto bg-stone-900 rounded-lg p-0 relative flex flex-col items-center shadow-lg">

        <!-- Tabla -->
        <div class="w-full mt-10 px-10 pb-10 flex flex-col items-center">
            <div class="w-full rounded-t-lg overflow-hidden shadow-lg">
                <div class="bg-stone-900 text-center py-2">
                    <h1 class="text-gray-300 font-semibold">Talleres Registrados</h1>
                </div>

                <table class="w-full border-collapse rounded-b-lg overflow-hidden">
                    <thead>
                        <tr class="bg-stone-900">
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">#</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Type</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Launch Date</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Start Time</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Duration</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Title</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Description</th>
                            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Contribuitor</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach( ['Taller'] as $taller)
                        <tr class="bg-stone-800 cursor-pointer user-row">
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $taller }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $taller }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $taller }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $taller }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $taller }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $taller }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $taller }}</td>
                            <td class="border border-stone-700 px-4 py-3 text-gray-300 text-center">{{ $taller }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>


    <div class="w-full max-w-4xl mx-auto flex justify-between mt-12 px-2">
        <!-- Create  -->
        <a href="{{ route('createTaller') }}"
            class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-teal-300 to-green-300 hover:scale-110 transform duration-300 border-2 border-teal-300">
            Create Taller
        </a>

        <!-- Update  -->
        <form action="{{ route('updateTaller') }}">
            @csrf
            <button class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-pink-400 to-blue-400 hover:scale-110 transform duration-300">
                Update Taller
            </button>
        </form>

        <!-- Delete  -->
        <form id="disableForm" action="" method="POST">
            @csrf
            <button type="button" id="deleteBtn" class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-red-500 to-pink-400 hover:scale-110 transform duration-300">
                Delete Taller
            </button>
        </form>
    </div>

    <!-- Panel para confirmar eliminacion -->
    <div id="confirmModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-lg p-6 w-96 text-center">
            <h2 class="text-2xl font-bold mb-4">¿Eliminar Taller?</h2>
            <p class="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
            <div class="flex justify-center gap-4">
                <button id="cancelBtn" class="px-6 py-2 rounded-full bg-gray-300 hover:bg-gray-400 text-black font-semibold">
                    Cancelar
                </button>
                <button id="confirmBtn" class="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold">
                    Sí, eliminar
                </button>
            </div>
        </div>
    </div>
</body>

<script>
    const deleteBtn = document.getElementById("deleteBtn");
    const confirmModal = document.getElementById("confirmModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");
    const disableForm = document.getElementById("disableForm");

    // Mostrar el modal
    deleteBtn.addEventListener("click", () => {
        confirmModal.classList.remove("hidden");
        confirmModal.classList.add("flex"); // para centrar con flex
    });

    // Cancelar
    cancelBtn.addEventListener("click", () => {
        confirmModal.classList.add("hidden");
        confirmModal.classList.remove("flex");
    });

    // Confirmar eliminación
    confirmBtn.addEventListener("click", () => {
        disableForm.submit();
    });
</script>

</html>