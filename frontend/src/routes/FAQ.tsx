import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";

export const Route = createFileRoute('/FAQ')({
  component: RouteComponent,
})


function RouteComponent() {
  const faqs = [
    {
      question: "¿Cómo funcionan las comisiones?",
      answer:
        "Las comisiones te permiten ofrecer servicios personalizados a otros usuarios. Puedes establecer tus precios, términos y condiciones en tu perfil, y los usuarios pueden contratar tus servicios a través de la plataforma.",
    },
    {
      question: "¿Cómo creo una publicación?",
      answer:
        "Para crear una publicación, haz clic en el botón '+' flotante en tu perfil o en la página principal. Completa la descripción y, agrega una imagen. Luego, guarda la publicación y se mostrará en tu muro.",
    },
    {
      question: "¿Cómo bloqueo usuarios?",
      answer:
        "Puedes bloquear usuarios específicos desde tu lista de seguidores. Esto evita que ciertos usuarios comenten o vean tus publicaciones o te envíen mensajes.",
    },
    {
      question: "¿Puedo editar mis publicaciones?",
      answer:
        "Sí, puedes editar tus publicaciones mientras estén activas. Haz clic en el botón de edición (✎) en la publicación que quieras modificar.",
    },
    {
      question: "¿Cómo puedo contactar a soporte?",
      answer:
        "Si tienes problemas, envíanos un mensaje a través del formulario de contacto en la sección 'Soporte' o usa nuestro correo de soporte indicado en la plataforma.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-400">Frequently Questions (FAQ)</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              className="w-full text-left p-4 bg-stone-800 text-white font-semibold hover:bg-stone-700 transition-colors"
              onClick={() => toggle(index)}
            >
              {faq.question}
            </button>
            {openIndex === index && (
              <div className="p-4 bg-stone-900 text-gray-200">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RouteComponent;