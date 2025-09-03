<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create User</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black min-h-screen flex items-center justify-center p-8">

    <div class="w-full max-w-md bg-gray-200 rounded-xl p-10 shadow-lg">
        <h2 class="text-center text-2xl font-bold text-black mb-6">New User</h2>

        @if(session('success'))
            <p class="text-green-600 text-center mb-4">{{ session('success') }}</p>
        @endif

        @if($errors->any())
            <div class="mb-4 text-red-600">
                <ul class="list-disc list-inside">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('storeUser') }}" method="POST" class="flex flex-col gap-4">
            @csrf

            <div>
                <label class="block text-sm text-black">Name</label>
                <input type="text" name="name" value="{{ old('name') }}" class="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none">
            </div>

            <div>
                <label class="block text-sm text-black">Email</label>
                <input type="email" name="email" value="{{ old('email') }}" class="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none">
            </div>

            <div>
                <label class="block text-sm text-black">Phone</label>
                <input type="tel" name="phone" value="{{ old('phone') }}" class="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none">
            </div>

            <div>
                <label class="block text-sm text-black">Address</label>
                <input type="text" name="address" value="{{ old('address') }}" class="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none">
            </div>

            <div>
                <label class="block text-sm text-black">Password</label>
                <input type="password" name="password" class="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none">
            </div>

            <div>
                <label class="block text-sm text-black">Confirm Password</label>
                <input type="password" name="password_confirmation" class="w-full px-3 py-2 border-b border-gray-500 bg-transparent text-black focus:outline-none">
            </div>

            <button type="submit" class="mt-6 py-2 rounded-full bg-green-400 text-black font-semibold hover:scale-105 duration-200">
                Create user
            </button>

            <a href="{{ url()->previous() }}" class="block mt-4 py-2 text-center rounded-full bg-red-400 text-black font-semibold hover:scale-105 duration-200">
                Cancel
            </a>
        </form>
    </div>
</body>
</html>
