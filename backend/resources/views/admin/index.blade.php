<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Usuarios</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Starstruck&display=swap" rel="stylesheet">
</head>
<body class="bg-stone-950 min-h-screen p-8">

    <!-- Título principal -->
    <div class="mb-8 pl-4">
        <h2 class="text-2xl font-bold" style="color:#ec4899; font-family: 'Starstruck', cursive;">
            Registro De Usuarios
        </h2>
    </div>

    <!-- Card contenedor -->
    <div class="w-full max-w-6xl mx-auto bg-stone-900 rounded-lg p-0 relative flex flex-col items-center shadow-lg">

        <!-- Tabla -->
        <div class="w-full mt-10 px-10 pb-10 flex flex-col items-center">
            <div class="w-full rounded-t-lg overflow-hidden shadow-lg">
                <div class="bg-stone-900 text-center py-2">
                    <h1 class="text-gray-300 font-semibold">Usuarios Registrados</h1>
                </div>

                <table class="w-full border-collapse rounded-b-lg overflow-hidden">
    <thead>
        <tr class="bg-stone-900">
            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">#</th>
            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Image</th>
            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">User</th>
            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Email</th>
            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Phone</th>
            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Address</th>
            <th class="border border-stone-700 px-4 py-2 text-white font-semibold">Activo</th>
        </tr>
    </thead>
    <tbody>
        @foreach($users as $user)
            <tr class="bg-stone-800 cursor-pointer user-row"
                data-user-id="{{ $user->id }}">
                <td class="border border-stone-700 px-4 py-3 text-gray-300">{{ $loop->iteration }}</td>
                <td class="border border-stone-700 px-4 py-3 text-gray-300">
                    <img src="{{ $user->image_path() }}" alt="{{ $user->name }}" class="w-10 h-10 rounded-full">
                </td>
                <td class="border border-stone-700 px-4 py-3 text-gray-300">{{ $user->name }}</td>
                <td class="border border-stone-700 px-4 py-3 text-gray-300">{{ $user->email }}</td>
                <td class="border border-stone-700 px-4 py-3 text-gray-300">{{ $user->phone }}</td>
                <td class="border border-stone-700 px-4 py-3 text-gray-300">{{ $user->address }}</td>
                <td class="border border-stone-700 px-4 py-3 text-gray-300">
                    @if($user->is_active)
                        <span class="text-green-500 font-semibold">Sí</span>
                    @else
                        <span class="text-red-500 font-semibold">No</span>
                    @endif
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
            </div>
        </div>
    </div>

    <!-- Botones -->
    <div class="w-full max-w-4xl mx-auto flex justify-between mt-12 px-2">
    <!-- Create -->
    <a href="{{ route('createUser') }}" 
       class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-teal-300 to-green-300 hover:shadow-lg border-2 border-teal-300">
        Create user
    </a>

    <!-- Enable -->
    <form id="enableForm" action="" method="POST">
        @csrf
        <input type="hidden" name="user_id" id="enableUserId">
        <button type="submit" class="px-8 py-2 rounded-full font-semibold text-black bg-yellow-400 hover:shadow-lg">
            Enable user
        </button>
    </form>

    <!-- Disable -->
    <form id="disableForm" action="" method="POST">
        @csrf
        <input type="hidden" name="user_id" id="disableUserId">
        <button type="submit" class="px-8 py-2 rounded-full font-semibold text-black bg-pink-400 hover:shadow-lg">
            Disable user
        </button>
    </form>

    <!-- Logout -->
    <form action="{{ route('admin.logout') }}" method="POST">
        @csrf
        <button type="submit" class="px-8 py-2 rounded-full font-semibold text-black bg-gradient-to-r from-pink-400 to-blue-400 hover:shadow-lg">
            Logout
        </button>
    </form>
</div>

</body>
        <script>
    let selectedUserId = null;

    document.querySelectorAll('.user-row').forEach(row => {
        row.addEventListener('click', function() {
            selectedUserId = this.dataset.userId;

            // remarcar fila seleccionada
            document.querySelectorAll('.user-row').forEach(r => r.classList.remove('bg-stone-600'));
            this.classList.add('bg-stone-600');

            // asignar a formularios
            document.getElementById('enableForm').action = `/admin/users/${selectedUserId}/enable`;
            document.getElementById('enableUserId').value = selectedUserId;

            document.getElementById('disableForm').action = `/admin/users/${selectedUserId}/disable`;
            document.getElementById('disableUserId').value = selectedUserId;

            document.getElementById('resetUserId').value = selectedUserId;
        });
    });
</script>
</html>
