import axios from "axios";
import { useEffect, useState } from "react";

interface Plan {
  title: string;
  price: string;
  features: string[];
}

const SuscriptionsPage = () => {
  const plans: Plan[] = [
    {
      title: "Monthly",
      price: "$ 8.00",
      features: ["Create Events", "Create Workshops", "Promote Content", "Verification Badge"],
    },
    {
      title: "Annual",
      price: "$ 76.08",
      features: ["Create Events", "Create Workshops", "Promote Content", "Verification Badge"],
    },
  ];

  const token = localStorage.getItem("access_token");
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return console.warn("No hay token en localStorage");

      try {
        const res = await axios.get("https://harixom-desarrollo.onrender.com/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Usuario cargado desde backend:", res.data);
        setUser(res.data.user);
        setIsPremium(res.data.user.is_premium);
      } catch (err: any) {
        console.error("Error al obtener usuario:", err.response ? err.response.data : err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleSubscribe = async (plan: string) => {
    if (!token || !user) return alert("Debes iniciar sesión");

    console.log("Iniciando suscripción para plan:", plan, "Usuario:", user);
    setLoadingAction(true);

    try {
      const res = await axios.post(
        "https://harixom-desarrollo.onrender.com/api/create-checkout-session",
        { plan },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      console.log("Respuesta del servidor al crear checkout session:", res.data);
      window.location.href = res.data.url;
    } catch (err: any) {
      console.error("Error Axios al crear sesión:", err.response ? err.response.data : err);
      alert("Error al crear la sesión de Stripe.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!token || !user) return alert("Debes iniciar sesión");

    console.log("Intentando cancelar suscripción para usuario:", user);
    setLoadingAction(true);

    try {
      const res = await axios.post(
        "https://harixom-desarrollo.onrender.com/api/cancelSubscription",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Respuesta al cancelar suscripción:", res.data);
      alert("Suscripción cancelada con éxito");
      setIsPremium(false);
    } catch (err: any) {
      console.error("Error cancelando suscripción:", err.response ? err.response.data : err);
      alert("Error al cancelar la suscripción.");
    } finally {
      setLoadingAction(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex bg-stone-950 text-white items-center h-full justify-center pb-20">
        <div className="flex space-x-3">
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce "></div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-stone-950 text-white flex flex-col items-center py-20 px-4">
      <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-pink-300 flex gap-1 pb-10">
        {"Suscriptions".split("").map((char, i) => (
          <span
            key={i}
            className="inline-block animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "6s",
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
              display: "inline-block",
            }}
          >
            {char}
          </span>
        ))}
      </h1>

      {isPremium && (
        <div className="mb-10 text-center">
          <p className="text-green-400 font-semibold mb-2">¡Eres usuario premium!</p>
          <button
            onClick={handleCancelSubscription}
            disabled={loadingAction}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition"
          >
            {loadingAction ? "Cancelando..." : "Cancelar Suscripción"}
          </button>
        </div>
      )}

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
            {!isPremium && (
              <button
                onClick={() => handleSubscribe(plan.title.toLowerCase())}
                disabled={loadingAction}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-full transition"
              >
                {loadingAction ? "Procesando..." : "Order Now"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuscriptionsPage;
