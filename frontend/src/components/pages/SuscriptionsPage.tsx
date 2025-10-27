import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "../ui/Toast";

interface Plan {
  title: string;
  price: string;
  features: string[];
}

const SuscriptionsPage = () => {
  const { showToast } = useToast();
  const plans: Plan[] = [
    {
      title: "Monthly",
      price: "$ 8.00",
      features: [
        "Create Events",
        "Create Workshops",
        "Promote Content",
        "Verification Badge",
      ],
    },
    {
      title: "Annual",
      price: "$ 76.08",
      features: [
        "Create Events",
        "Create Workshops",
        "Promote Content",
        "Verification Badge",
      ],
    },
  ];

  const token = localStorage.getItem("access_token");
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        console.warn("No hay token en localStorage");
        showToast("No hay sesión activa. Inicia sesión primero.");
        return;
      }

      try {
        const res = await axios.get(
          "https://harixom-desarrollo.onrender.com/api/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data.user);
        setIsPremium(res.data.user.is_premium);
      } catch (err: any) {
        console.error("Error al obtener usuario:", err);
        showToast("Error al cargar tu perfil. Intenta de nuevo.", "error");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleSubscribe = async (plan: string) => {
    if (!token || !user) {
      showToast("Debes iniciar sesión antes de suscribirte.");
      return;
    }

    setLoadingAction(true);
    try {
      const res = await axios.post(
        `https://harixom-desarrollo.onrender.com/api/create-checkout-session`,
        { plan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showToast("Redirigiendo a Stripe...", "info");
      window.location.href = res.data.url;
    } catch (err: any) {
      console.error("Error creando sesión:", err);
      showToast("Error al crear la sesión de Stripe.", "error");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!token || !user) {
      showToast("Debes iniciar sesión primero.");
      return;
    }

    setLoadingAction(true);
    try {
      const res = await axios.post(
        `https://harixom-desarrollo.onrender.com/api/cancelSubscription`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Respuesta al cancelar suscripción:", res.data);
      setIsPremium(false);
      showToast("Suscripción cancelada con éxito.", "success");
    } catch (err: any) {
      console.error("Error cancelando suscripción:", err);
      showToast("No se pudo cancelar la suscripción.", "error");
    } finally {
      setLoadingAction(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex bg-stone-950 text-white items-center h-full justify-center pb-20" style={{ fontFamily: "Monserrat" }}>
        <div className="flex space-x-3">
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.6s]"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 text-white flex flex-col items-center py-20 px-6" style={{ fontFamily: "Monserrat" }}>
      {/* Título */}
      <h1 className="text-5xl md:text-7xl font-extrabold mb-16 text-center text-pink-300 bg-clip-text animate-pulse">
        {"Premium Plans".split("").map((char, i) => (
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

      {/* Estado premium */}
      {isPremium && (
        <div className="mb-10 text-center bg-purple-950/30 px-6 py-4 rounded-2xl border border-purple-200 shadow-lg shadow-purple-800/30 mt-0 duration-300 hover:scale-105">
          <p className="text-white font-semibold mb-3 text-lg">
            You’re currently a Premium User!
          </p>
          <button
            onClick={handleCancelSubscription}
            disabled={loadingAction}
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-8 rounded-full transition-all duration-300 hover:scale-105"
          >
            {loadingAction ? "Cancelling..." : "Cancel Subscription"}
          </button>
        </div>
      )}

      {/* Planes */}
      <div className="flex flex-col md:flex-row gap-10 mt-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-lg border border-white/10 hover:border-pink-400 rounded-3xl p-8 w-80 flex flex-col items-center shadow-2xl hover:shadow-pink-500/20 transform hover:-translate-y-2 transition-all duration-300"
          >
            <h2 className="text-3xl font-semibold mb-3 text-pink-400 drop-shadow-md">
              {plan.title}
            </h2>
            <p className="text-4xl font-extrabold text-white mb-6">
              {plan.price}
            </p>
            <ul className="text-gray-300 mb-8 space-y-3 text-center">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 justify-center text-sm"
                >
                  <span className="text-pink-400">✔</span> {feature}
                </li>
              ))}
            </ul>

            {!isPremium ? (
              <button
                onClick={() => handleSubscribe(plan.title.toLowerCase())}
                disabled={loadingAction}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                {loadingAction ? "Processing..." : "Subscribe"}
              </button>
            ) : (
              <button
                disabled
                className="bg-purple-900/50 text-purple-300 font-semibold py-2 px-6 rounded-full cursor-default"
              >
                Active
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuscriptionsPage;
