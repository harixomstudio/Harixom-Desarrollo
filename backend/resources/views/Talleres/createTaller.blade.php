<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creación de Talleres</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Starstruck&display=swap" rel="stylesheet">
</head>

<body>
    <main class="w-full h-full bg-[#131313] text-white p-24" style="font-family: 'Starstruck', cursive;">

        <div class="w-full h-full bg-[#2c2c2c] rounded-[4rem] p-40">
            <h1 class="text-8xl font-semibold mb-16 text-pink-500">Create a Taller</h1>

            <!-- IMPORTANTE: usa la ruta correcta -->
            <form action="{{ route('storeTaller') }}" method="POST" enctype="multipart/form-data">
                @csrf
                @method('POST')

                <div class="flex flex-col">

                    <!-- Mode -->
                    <h3 class="mb-4 text-4xl font-semibold">Mode</h3>
                    <select class="mb-20 border-b-2 bg-[#2c2c2c] p-3 text-2xl outline-none" name="mode">
                        <option value='type' disabled selected class="bg-[#2c2c2c] text-2xl"> Select a Mode </option>
                        <option value="Virtual" class="bg-[#474747] text-2xl">Virtual</option>
                        <option value="Presential" class="bg-[#474747] text-2xl">Presential</option>
                    </select>

                    <!-- Date Start / Time Start -->
                    <div class="columns-2 mb-10 w-2/3 gap-20">
                        <div>
                            <h3 class="mb-4 text-4xl font-semibold">Date Start</h3>
                            <input class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]"
                                type="date" name="dateStart" value="{{ old('dateStart') }}" />
                        </div>
                        <div>
                            <h3 class="mb-4 text-4xl font-semibold">Time Start</h3>
                            <input class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]"
                                type="time" name="timeStart" value="{{ old('timeStart') }}" />
                        </div>
                    </div>

                    <!-- Contribuitor -->
                    <h3 class="mb-4 text-4xl font-semibold">Contributor</h3>
                    <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]"
                        type="text" name="contributor" value="{{ old('contributor') }}" />

                    <!-- Title -->
                    <h3 class="mb-4 text-4xl font-semibold">Title</h3>
                    <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]"
                        type="text" name="title" value="{{ old('title') }}" />

                    <!-- Duration / Place -->
                    <div class="columns-2 mb-10 w-2/3 gap-20">
                        <div>
                            <h3 class="mb-4 text-4xl font-semibold">Duration</h3>
                            <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]"
                                type="text" name="duration" value="{{ old('duration') }}" />
                        </div>
                        <div>
                            <h3 class="mb-4 text-4xl font-semibold">Place</h3>
                            <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]"
                                type="text" name="place" value="{{ old('place') }}" />
                        </div>
                    </div>

                    <!-- Description -->
                    <h3 class="mb-4 text-4xl font-semibold">Description</h3>
                    <textarea class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]"
                        name="description">{{ old('description') }}</textarea>

                    <h3 class="mb-4 text-4xl font-semibold">Image</h3>
                    <input type="file" name="image" id="tallerImageInput" class="mb-20 text-white">

                    <!-- Submit -->
                    <button type="submit"
                        class="text-4xl w-1/4 bg-[#48e1ec] hover:bg-[#3ab9c2] duration-300 text-black font-semibold py-6 rounded-full">
                        Create Taller
                    </button>
                </div>
            </form>
        </div>
    </main>
    <script>
        const form = document.querySelector('form');
        const imageInput = document.getElementById('tallerImageInput');

        form.addEventListener('submit', (e) => {
            const file = imageInput.files[0];
            if (file) {
                const maxSize = 3 * 1024 * 1024; // 3 MB en bytes
                if (file.size > maxSize) {
                    e.preventDefault(); // Evita que el formulario se envíe
                    alert('La imagen no puede superar 3MB');
                }
            }
        });
    </script>
</body>

</html>