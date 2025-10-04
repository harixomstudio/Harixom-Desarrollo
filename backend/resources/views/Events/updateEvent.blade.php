<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualizacion de Eventos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Starstruck&display=swap" rel="stylesheet">
</head>

<body>
    <main class="w-full h-full bg-[#131313] text-white p-24 ">

        <div class="w-full h-full bg-[#2c2c2c] rounded-[4rem] p-40 ">
            <h1 class="text-8xl font-semibold mb-16 text-pink-500">Update a event</h1>
            <form action="{{ route('updateEventAction', $event->id) }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div class="flex flex-col">
                    <h3 class="mb-4 text-4xl font-semibold ">Type</h3>
                    <select name="type" class="mb-20 border-b-2 bg-[#2c2c2c] p-3 text-2xl outline-none">
                        <option value="Workshop" {{ $event->type=='Workshop'?'selected':'' }}>Workshop</option>
                        <option value="Taller" {{ $event->type=='Taller'?'selected':'' }}>Taller</option>
                        <option value="Challenge" {{ $event->type=='Challenge'?'selected':'' }}>Challenge</option>
                    </select>
                    <div class="columns-2 mb-10 w-2/3 gap-20 ">
                        <h3 class="mb-4 text-4xl font-semibold">Date Start</h3>
                        <input type="date" name="dateStart" value="{{ $event->dateStart }}" class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />

                        <h3 class="mb-4 text-4xl font-semibold">Time Start</h3>
                        <input type="time" name="timeStart" value="{{ $event->timeStart }}" class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />
                    </div>

                    <h3 class="mb-4 text-4xl font-semibold">Title</h3>
                    <input type="text" name="title" value="{{ $event->title }}" class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />

                    <h3 class="mb-4 text-4xl font-semibold">Description</h3>
                    <input type="text" name="description" value="{{ $event->description }}" class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />
                    <div class="columns-2 mb-10 w-2/3 gap-20 ">
                        <h3 class="mb-4 text-4xl font-semibold">Date End</h3>
                        <input type="date" name="dateEnd" value="{{ $event->dateEnd }}" class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />

                        <h3 class="mb-4 text-4xl font-semibold">Time End</h3>
                        <input type="time" name="timeEnd" value="{{ $event->timeEnd }}" class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" />
                    </div>
                    <h3 class="mb-4 text-4xl font-semibold">Image</h3>
                        @if($event->image)
                    <img src="{{ asset('storage/'.$event->image) }}" alt="Current Image" class="w-64 mb-4">
                        @endif
                    <input type="file" name="image" class="mb-20 text-white">

                    <button type="submit" class="text-4xl w-1/4 bg-[#48e1ec] hover:bg-[#3ab9c2] duration-300 text-black font-semibold py-6 rounded-full">Edit Event</button>
                </div>
            </form>
        </div>
    </main>


</body>

</html>