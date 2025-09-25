<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualización de Taller</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Starstruck&display=swap" rel="stylesheet">
</head>

<body>
    <main class="w-full h-full bg-[#131313] text-white p-24" style="font-family: 'Starstruck', cursive;">

        <div class="w-full h-full bg-[#2c2c2c] rounded-[4rem] p-40">
            <h1 class="text-8xl font-semibold mb-16 text-pink-500">Update Taller</h1>
            
            <form action="{{ route('updateTallerAction', $taller->id) }}" method="POST">
    @csrf
    @method('PUT')
                <div class="flex flex-col">
                    <h3 class="mb-4 text-4xl font-semibold">Mode</h3>
                    <select name="mode" class="mb-20 border-b-2 bg-[#2c2c2c] p-3 text-2xl outline-none">
                        <option value="Virtual" {{ $taller->mode == 'Virtual' ? 'selected' : '' }}>Virtual</option>
                        <option value="Presential" {{ $taller->mode == 'Presential' ? 'selected' : '' }}>Presential</option>
                    </select>

                    <div class="columns-2 mb-10 w-2/3 gap-20">
                        <div>
                            <h3 class="mb-4 text-4xl font-semibold">Date Start</h3>
                            <input type="date" name="dateStart" value="{{ $taller->dateStart }}" 
                                class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />
                        </div>

                        <div>
                            <h3 class="mb-4 text-4xl font-semibold">Time Start</h3>
                            <input type="time" name="timeStart" value="{{ $taller->timeStart }}" 
                                class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />
                        </div>
                    </div>

                    <h3 class="mb-4 text-4xl font-semibold">Contributor</h3>
                    <input type="text" name="contributor" value="{{ $taller->contributor }}" 
                        class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />

                    <h3 class="mb-4 text-4xl font-semibold">Title</h3>
                    <input type="text" name="title" value="{{ $taller->title }}" 
                        class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />

                    <div class="columns-2 mb-10 w-2/3 gap-20">
                        <div>
                            <h3 class="mb-4 text-4xl font-semibold">Duration</h3>
                            <input type="text" name="duration" value="{{ $taller->duration }}" 
                                class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />
                        </div>

                        <div>
                            <h3 class="mb-4 text-4xl font-semibold">Place</h3>
                            <input type="text" name="place" value="{{ $taller->place }}" 
                                class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />
                        </div>
                    </div>

                    <h3 class="mb-4 text-4xl font-semibold">Description</h3>
                    <input type="text" name="description" value="{{ $taller->description }}" 
                        class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />

                    <button type="submit" 
                        class="text-4xl w-1/4 bg-[#48e1ec] hover:bg-[#3ab9c2] duration-300 text-black font-semibold py-6 rounded-full">
                        Edit Taller
                    </button>
                </div>
            </form>
        </div>
    </main>
</body>
</html>
