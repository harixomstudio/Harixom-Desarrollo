import axios from "axios";

const SuscriptionsPage = () => {
  const plans = [
    {
      title: "Monthly",
      price: "$9.99",
      features: [
        "Create Events",
        "Create Workshops",
        "Promote Content",
        "Verification Badge",
      ],
    },
    {
      title: "Annual",
      price: "$84.99",
      features: [
        "Create Events",
        "Create Workshops",
        "Promote Content",
        "Verification Badge",
      ],
    },
  ];

  const token = localStorage.getItem("access_token");
  console.log("Access token:", token); // Verificar si hay token

  const handleSubscription = async (plan: string) => {
    console.log("Iniciando creación de suscripción para plan:", plan);
    if (!token) {
      console.warn("No hay token de acceso");
      alert("No estás autenticado");
      return;
    }

    try {
      console.log("Enviando request a backend...");
      const response = await axios.post(
        "https://harixom-desarrollo.onrender.com/api/subscriptions/createCheckoutSession",
        { plan: plan.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Respuesta del backend:", response);
      console.log("URL de checkout:", response.data.url);

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("No se recibió URL del checkout");
        alert("No se pudo crear la sesión de Stripe");
      }
    } catch (err: any) {
      console.error("Error al crear la sesión de Stripe:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
      }
      alert("Error creando la sesión de Stripe. Revisa la consola para más detalles.");
    }
  };

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center py-20 px-4" style={{ fontFamily: "Monserrat" }}>
      <h1
        className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-pink-300 flex gap-1 pb-10"
        style={{ fontFamily: "Monserrat" }}
      >
        {"Suscriptions".split("").map((char, i) => (
          <span
            key={i}
            className="inline-block animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "6.0s",
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
              display: "inline-block",
            }}
          >
            {char}
          </span>
        ))}
      </h1>
      <div className="flex flex-col md:flex-row gap-10">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-xl p-8 w-80 flex flex-col items-center shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">{plan.title}</h2>
            <p className="text-3xl font-bold text-pink-400 mb-6">{plan.price}</p>
            <ul className="text-sm text-gray-300 mb-6 space-y-2 text-center">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscription(plan.title)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full transition"
            >
              Order Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuscriptionsPage;
