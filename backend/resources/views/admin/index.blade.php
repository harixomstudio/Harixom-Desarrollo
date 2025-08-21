<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Starstruck&display=swap" rel="stylesheet">
</head>
<body>
<section class="relative flex flex-col min-h-screen items-center justify-start bg-stone-950 p-6 space-y-6">

    <!-- TARJETA GRIS -->
     <h1 class="text-3xl font-bold text-center text-pink-500 mb-8" style="font-family: 'Starstruck', cursive;">
            Admin Dashboard
        </h1>
    <div class="w-full max-w-6xl bg-[#2A2A2A] opacity-90 p-8 rounded-3xl">
        

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-x divide-black">
                <thead class="bg-[#2A2A2A]">
                    <tr>
                        <th class="px-6 py-3 text-left text-sm font-medium text-white">#</th>
                        <th class="px-6 py-3 text-left text-sm font-medium text-white">Image</th>
                        <th class="px-6 py-3 text-left text-sm font-medium text-white">Name</th>
                        <th class="px-6 py-3 text-left text-sm font-medium text-white">Email</th>
                        <th class="px-6 py-3 text-left text-sm font-medium text-white">Phone</th>
                        <th class="px-6 py-3 text-left text-sm font-medium text-white">Address</th>
                        <th class="px-6 py-3 text-left text-sm font-medium text-white">Profile Completed</th>
                    </tr>
                </thead>
                <tbody class="bg-[#2A2A2A] divide-y divide-x divide-black">
                    @foreach($users as $user)
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-white">{{ $loop->iteration }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <img src="{{ $user->image_path() }}" alt="{{ $user->name }}" class="w-10 h-10 rounded-full">
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-white">{{ $user->name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-white">{{ $user->email }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-white">{{ $user->phone }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-white">{{ $user->address }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-white">
                                @if($user->profile_completed)
                                    <span class="text-green-600 font-semibold">Yes</span>
                                @else
                                    <span class="text-red-600 font-semibold">No</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <!-- BOTONES DEBAJO DEL CUADRO -->
    <div class="flex flex-wrap justify-center gap-4 w-full max-w-6xl">
        <!-- Create User -->
        <button class="flex-1 min-w-[150px] py-2 rounded-full text-white font-semibold bg-[#18B672] border-2 border-[#96E2FF]">
            Create user
        </button>
        <!-- Enable User -->
        <button class="flex-1 min-w-[150px] py-2 rounded-full text-black font-semibold bg-[#FDD519] border-2 border-[#DBFF4F]">
            Enable user
        </button>
        <!-- Disable User -->
        <button class="flex-1 min-w-[150px] py-2 rounded-full text-black font-semibold bg-[#FDD519] border-2 border-[#DBFF4F]">
            Disable user
        </button>
        <!-- Reset Password -->
        <button class="flex-1 min-w-[150px] py-2 rounded-full text-white font-semibold bg-[#FA6063] border-2 border-[#F778BD]">
            Reset password
        </button>
        <!-- Logout -->
        <form action="{{ route('admin.logout') }}" method="POST" class="flex-1 min-w-[150px]">
    @csrf
    <button type="submit" class="w-full py-2 rounded-full text-white font-semibold bg-gradient-to-r from-pink-400 to-blue-400">
        Logout
    </button>
</form>
    </div>

</section>
</body>
</html>
