<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Starstruck&display=swap" rel="stylesheet">
</head>
<body>
    <section class="relative flex min-h-screen items-center justify-center bg-stone-950">
        <img
            src="{{ asset('circles.svg') }}"
            alt="circles background"
            class="absolute inset-0 w-full h-full object-cover opacity-20"
        />

        <div class="relative z-10 flex lg:w-3/4">
            <!-- IZQUIERDA -->
            <div class="hidden md:flex w-1/2 flex-col items-center justify-center text-center p-8">
                <p class="text-lg text-white">Welcome to</p>
                <h1
                    class="mt-4 text-5xl md:text-7xl text-pink-500"
                    style="font-family: 'Starstruck', cursive;">
                    HARIXOM
                </h1>
                <p class="text-lg text-white mt-6">For admins</p>
            </div>

            <!-- DERECHA -->
            <div class="w-full md:w-1/2 bg-gray-200 opacity-90 p-10 md:px-16 md:py-24 flex flex-col justify-center rounded-3xl">
            
            @session('error')
            <div class="alert alert-danger my-2"></div>
            {{session('error')}}
            @endsession
            
            <h2 class="text-2xl font-bold text-center mb-6 text-black">
                    Login
                </h2>

                <!-- FORMULARIO -->
                <form method="POST" action="{{ route('admin.auth') }}" class="flex flex-col gap-4">
                    @csrf

                    <div>
                        <label for="email" class="block text-sm mb-1 text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value="{{ old('email') }}"
                            required
                            class="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none form-control @error('email') is-invalid @enderror"
                        >
                        @error('email')
                        <span class="invalid-feedback text-red-500 text-sm"><strong>{{$message}}</strong></span>
                        @enderror
                    </div>

                    <div>
                        <label for="password" class="block text-sm mb-1 text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            class="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none @error('password') is-invalid @enderror"
                        >
                        @error('password')
                        <span class="invalid-feedback text-red-500 text-sm"><strong>{{$message}}</strong></span>
                        @enderror
                    </div>

                    <button
                        type="submit"
                        class="w-full py-2 mt-4 rounded-full text-white font-semibold bg-gradient-to-r from-pink-400 to-blue-400"
                    >
                        LOGIN
                    </button>
                </form>

            </div>
        </div>
    </section>
</body>
</html>
