export function addWatermark(imageUrl: string, watermarkText: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Permite cargar imágenes externas
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject("No se pudo obtener el contexto del canvas");
        return;
      }

      // Configurar el tamaño del canvas según la imagen original
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibujar la imagen original en el canvas
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Configurar el estilo del texto
      const fontSize = Math.floor(img.width * 0.05); // Tamaño del texto (5% del ancho de la imagen)
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // Texto blanco con transparencia
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Calcular el espacio entre las marcas de agua
      const textWidth = ctx.measureText(watermarkText).width;
      const textHeight = fontSize * 1.5; // Altura del texto con un poco de espacio
      const offsetX = textWidth + 110; // Espaciado horizontal
      const offsetY = textHeight + 100; // Espaciado vertical

      // Rotar el contexto para inclinar el texto
      const angle = -Math.PI / 6; // Ángulo de inclinación (-30 grados)
      ctx.save(); // Guardar el estado del contexto
      ctx.translate(canvas.width / 2, canvas.height / 2); // Mover el origen al centro del canvas
      ctx.rotate(angle); // Rotar el contexto

      // Dibujar el texto repetidamente en un patrón de mosaico
      for (let y = -canvas.height; y < canvas.height; y += offsetY) {
        for (let x = -canvas.width; x < canvas.width; x += offsetX) {
          ctx.fillText(watermarkText, x, y);
        }
      }

      ctx.restore(); // Restaurar el estado original del contexto

      // Convertir el canvas a una URL de imagen
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      reject("No se pudo cargar la imagen");
    };
  });
}