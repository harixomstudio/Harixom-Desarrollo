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
    <main class="w-full h-full bg-[#131313] text-white p-24 ">

        <div class="w-full h-full bg-[#2c2c2c] rounded-[4rem] p-40 ">
            <h1 class="text-8xl font-semibold mb-16 text-pink-500">Create a event</h1>
            <form id="eventForm" action="{{ route('storeEvent') }}" method="POST" enctype="multipart/form-data">
    @csrf
    @method('POST')

                <div class="flex flex-col">
                    <h3 class="mb-4 text-4xl font-semibold ">Type</h3>

                    <select class="mb-20 border-b-2 bg-[#2c2c2c] p-3 text-2xl outline-none " value='' name="type">
                        <option value='' disabled selected class="bg-[#2c2c2c] text-2xl"> Select a Type </option>
                        <option value="Workshop" key=type name="type" class="bg-[#474747] text-2xl ">Workshop</option>
                        <option value="Taller" key=type name="type" class="bg-[#474747] text-2xl ">Taller</option>
                        <option value="Challenge" key=type name="type" class="bg-[#474747] text-2xl ">Challenge</option>
                    </select>

                    <div class="columns-2 mb-10 w-2/3 gap-20 ">
                        <h3 class="mb-4 text-4xl font-semibold ">Date Start </h3>
                        <input class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c] appearance-none calen" type="date" name="dateStart" value="{{ old('dateStart') }}" />

                        <h3 class=" mb-4 text-4xl font-semibold ">Time Start</h3>
                        <input class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="time" name="timeStart" value="{{ old('timeStart') }}" />
                    </div>

                    <h3 class="mb-4 text-4xl font-semibold ">Title</h3>
                    <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="text" name="title" value="{{ old('title')}}" />

                    <h3 class="mb-4 text-4xl font-semibold ">Description</h3>
                    <input class="mb-20 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="text" name="description" value="{{ old('description')}}" />

                    <div class="columns-2 mb-10 w-2/3 gap-20 ">
                        <h3 class=" mb-4 text-4xl font-semibold ">Date End </h3>
                        <input class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="date" name="dateEnd" value="{{ old('dateEnd')}}" />

                        <h3 class="mb-4 text-4xl font-semibold ">Time End</h3>
                        <input class="w-full mb-10 border-b-2 p-3 text-3xl outline-none bg-[#2c2c2c]" type="time" name="timeEnd" value="{{ old('timeEnd')}}" />
                    </div>
                        <h3 class="mb-4 text-4xl font-semibold">Image</h3>
    <input type="file" name="image" id="imageInput" class="mb-20 text-white">

                    <button type="submit" class="text-4xl w-1/4 bg-[#48e1ec] hover:bg-[#3ab9c2] duration-300 text-black font-semibold py-6 rounded-full">Create Event</button>
                </div>
            </form>
        </div>
    </main>

    <script>
  const form = document.getElementById('eventForm');
  const imageInput = document.getElementById('imageInput');

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