<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creacion de Eventos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Starstruck&display=swap" rel="stylesheet">
</head>

<body>
    <main class="w-full h-full bg-[#131313] text-white p-24 " style="font-family: 'Starstruck', cursive;">

        <div class="w-full h-full bg-[#2c2c2c] rounded-[4rem] p-40 ">
            <h1 class="text-8xl font-semibold mb-16 text-pink-500">Create a Taller</h1>
            <form action="{{route('createEvent')}}" method="POST">
                @csrf
                @method('POST')

                <div class="flex flex-col">
                    <h3 class="mb-4 text-4xl font-semibold ">Mode</h3>
                    <select class="mb-20 border-b-2 bg-[#2c2c2c] p-3 text-2xl outline-none " value='' name="mode">
                        <option value='' disabled selected class="bg-[#2c2c2c] text-2xl"> Select a Mode </option>
                        <option value="Virtual" key=mode name="mode" class="bg-[#474747] text-2xl ">Virtual</option>
                        <option value="Presential" key=mode name="mode" class="bg-[#474747] text-2xl ">Presential</option>
                    </select>

                    <div class="columns-2 mb-10 w-2/3 gap-20 ">
                        <h3 class="mb-4 text-4xl font-semibold ">Date Start </h3>
                        <input class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c] appearance-none calen" type="date" name="dateStart" value="{{ old('dateStart') }}" />

                        <h3 class=" mb-4 text-4xl font-semibold ">Time Start</h3>
                        <input class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="time" name="timeStart" value="{{ old('timeStart') }}" />
                    </div>

                    <h3 class="mb-4 text-4xl font-semibold ">Contribuitor</h3>
                    <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="text" name="contribuitor" value="{{ old('contribuitor')}}" />
                    
                    <h3 class="mb-4 text-4xl font-semibold ">Title</h3>
                    <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="text" name="title" value="{{ old('title')}}" />
                    
                    <div class="columns-2 mb-10 w-2/3 gap-20 ">
                        <h3 class="mb-4 text-4xl font-semibold ">Duration</h3>
                        <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="" name="duration" value="{{ old('duration')}}" />

                        <h3 class="mb-4 text-4xl font-semibold ">Place</h3>
                        <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="text" name="place" value="{{ old('place')}}" />
                    </div>
                    
                    <h3 class="mb-4 text-4xl font-semibold ">Description</h3>
                    <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="text" name="description" value="{{ old('description')}}" />
                    

                    <button type="submit" class="text-4xl w-1/4 bg-[#48e1ec] hover:bg-[#3ab9c2] duration-300 text-black font-semibold py-6 rounded-full">Create Taller</button>
                </div>
            </form>
        </div>
    </main>


</body>

</html>