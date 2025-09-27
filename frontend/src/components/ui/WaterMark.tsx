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

      // Configurar el tamaño fijo del canvas
      const canvasWidth = 340; // Ajusta según el tamaño deseado
      const canvasHeight = 340; // Ajusta según el tamaño deseado
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Escalar la imagen para que ocupe todo el espacio del canvas
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = canvasWidth / canvasHeight;

      let scaledWidth, scaledHeight, offsetX, offsetY;

      if (imgAspectRatio > canvasAspectRatio) {
        // Imagen horizontal: ajusta al ancho del canvas
        scaledWidth = canvasWidth;
        scaledHeight = canvasWidth / imgAspectRatio;
        offsetX = 0;
        offsetY = (canvasHeight - scaledHeight) / 2;
      } else {
        // Imagen vertical: ajusta al alto del canvas
        scaledWidth = canvasHeight * imgAspectRatio;
        scaledHeight = canvasHeight;
        offsetX = (canvasWidth - scaledWidth) / 2;
        offsetY = 0;
      }

      // Dibujar la imagen escalada en el canvas
      ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

      // Configurar el estilo del fondo negro y texto
      const textHeight = 20; // Altura del fondo negro
      const textX = offsetX; // Posición izquierda del fondo negro
      const textY = offsetY + scaledHeight - textHeight; // Posición superior del fondo negro
      const textWidth = scaledWidth; // Ancho del fondo negro

      // Dibujar el fondo negro sobre la imagen
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Fondo negro semitransparente
      ctx.fillRect(textX, textY, textWidth, textHeight);

      // Dibujar el texto sobre el fondo negro
      ctx.font = "12px Arial"; // Tamaño y fuente del texto
      ctx.fillStyle = "white"; // Color blanco para el texto
      ctx.textAlign = "center";
      ctx.fillText(watermarkText, textX + textWidth / 2, textY + textHeight - 5); // Texto centrado verticalmente

      // Convertir el canvas a una URL de imagen
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      reject("No se pudo cargar la imagen");
    };
  });
}