import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import ReactFlagsSelect from "react-flags-select";
import { axiosRequest } from "../helpers/config";
import { useToast } from "../ui/Toast";
import TermsAndConditions from "./TermsAndConditionsPage";

interface RegisterProps {
  title: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  text: string;
  link: string;
}

interface UserForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export default function Register(props: RegisterProps) {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedIso, setSelectedIso] = useState("CR");
  const [selectedCode, setSelectedCode] = useState("+506");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showTerms, setShowTerms] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const phoneCodeMap: Record<string, string> = {
    CR: "+506", MX: "+52", ES: "+34", US: "+1", FR: "+33", DE: "+49", IT: "+39",
    AR: "+54", CO: "+57", CL: "+56", PE: "+51", VE: "+58", BR: "+55", CA: "+1",
    GB: "+44", JP: "+81", IN: "+91", CN: "+86", RU: "+7", AU: "+61", NZ: "+64"
  };

  const validatePhone = (value: string) => {
    const regex = /^\+\d{1,4}\d{6,12}$/;
    if (value && !regex.test(value)) {
      setPhoneError("");
    } else {
      setPhoneError("");
    }
  };

  const registerNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const fullPhone = `${selectedCode}${user.phone}`;
    validatePhone(fullPhone);

    if (phoneError) {
      showToast("Corrige el número de teléfono.", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", fullPhone);
    formData.append("address", user.address);
    formData.append("password", user.password);

    try {
      const response = await axiosRequest.post("user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast(response.data.message, "success");
      setTempEmail(user.email);
      setShowTerms(true);
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        showToast("Please fix the highlighted errors.", "error");
      } else {
        showToast("Error al registrar", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTerms = async () => {
    await handleSubmit(tempEmail);
    navigate({ to: "/Login" });
  };

  const handleSubmit = async (email: string) => {
    try {
      const response = await axiosRequest.post("welcome", { email });
      setTimeout(() => showToast(response.data.message), 3000);
    } catch (error: any) {
      setTimeout(() => showToast(
        error.response?.data?.error || "Error al enviar el correo.",
        "error"
      ), 3000);
    }
  };

  if (showTerms) {
    return (
      <TermsAndConditions
        title="Terms and Conditions"
        onAccept={handleAcceptTerms}
      />
    );
  }


  return (
    <section className="relative flex min-h-screen items-center justify-center bg-stone-950" style={{ fontFamily: "Montserrat" }}>
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <div className="relative z-10 flex w-3/4 max-lg:flex-col">
        <div className="md:flex w-1/2 flex-col items-center justify-center text-center p-8 max-lg:w-full">
          <p className="text-lg text-white max-lg:justify-center">Welcome to</p>
          <h1
            className="mt-10 text-5xl md:text-7xl text-pink-500 flex gap-1 max-lg:w-full max-lg:justify-center"
            style={{ fontFamily: "Starstruck" }}
          >
            {"HARIXOM".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s",
                  animationIterationCount: "infinite",
                  animationTimingFunction: "ease-in-out",
                  display: "inline-block",
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        <div className="w-full min-xl:w-1/2 bg-gray-200 opacity-90 p-7 px-15 flex flex-col justify-center rounded-3xl">
          <h2 className="text-2xl font-bold text-center mb-2 text-black">
            {props.title}
          </h2>

          <form className="flex flex-col gap-2" onSubmit={registerNewUser}>
            <div>
              <label className="block text-sm mb-1 text-gray-700">{props.name}</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700">{props.email}</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
            </div>

            <div>
              <label>{props.phone}</label>
              <div className="flex gap-1 items-center">
                <ReactFlagsSelect
                  selected={selectedIso}
                  onSelect={(isoCode) => {
                    setSelectedIso(isoCode);
                    setSelectedCode(phoneCodeMap[isoCode] || "");
                  }}
                  searchable
                  showSelectedLabel={true}
                  showOptionLabel={true}
                  placeholder="Selecciona un país"
                  className="w-55"
                  customLabels={{
                    AF: "Afganistán (+93)",
                    AL: "Albania (+355)",
                    DZ: "Argelia (+213)",
                    AO: "Angola (+244)",
                    AR: "Argentina (+54)",
                    AM: "Armenia (+374)",
                    AU: "Australia (+61)",
                    AT: "Austria (+43)",
                    AZ: "Azerbaiyán (+994)",
                    BH: "Baréin (+973)",
                    BD: "Bangladés (+880)",
                    BY: "Bielorrusia (+375)",
                    BE: "Bélgica (+32)",
                    BO: "Bolivia (+591)",
                    BA: "Bosnia y Herzegovina (+387)",
                    BR: "Brasil (+55)",
                    BG: "Bulgaria (+359)",
                    KH: "Camboya (+855)",
                    CM: "Camerún (+237)",
                    CA: "Canadá (+1)",
                    CL: "Chile (+56)",
                    CN: "China (+86)",
                    CO: "Colombia (+57)",
                    CR: "Costa Rica (+506)",
                    HR: "Croacia (+385)",
                    CY: "Chipre (+357)",
                    CZ: "Chequia (+420)",
                    DK: "Dinamarca (+45)",
                    DO: "República Dominicana (+1)",
                    EC: "Ecuador (+593)",
                    EG: "Egipto (+20)",
                    SV: "El Salvador (+503)",
                    EE: "Estonia (+372)",
                    ET: "Etiopía (+251)",
                    FI: "Finlandia (+358)",
                    FR: "Francia (+33)",
                    GE: "Georgia (+995)",
                    DE: "Alemania (+49)",
                    GH: "Ghana (+233)",
                    GR: "Grecia (+30)",
                    GT: "Guatemala (+502)",
                    HN: "Honduras (+504)",
                    HK: "Hong Kong (+852)",
                    HU: "Hungría (+36)",
                    IS: "Islandia (+354)",
                    IN: "India (+91)",
                    ID: "Indonesia (+62)",
                    IR: "Irán (+98)",
                    IQ: "Irak (+964)",
                    IE: "Irlanda (+353)",
                    IL: "Israel (+972)",
                    IT: "Italia (+39)",
                    JM: "Jamaica (+1)",
                    JP: "Japón (+81)",
                    JO: "Jordania (+962)",
                    KZ: "Kazajistán (+7)",
                    KE: "Kenia (+254)",
                    KR: "Corea del Sur (+82)",
                    KW: "Kuwait (+965)",
                    LV: "Letonia (+371)",
                    LB: "Líbano (+961)",
                    LT: "Lituania (+370)",
                    LU: "Luxemburgo (+352)",
                    MY: "Malasia (+60)",
                    MV: "Maldivas (+960)",
                    MT: "Malta (+356)",
                    MX: "México (+52)",
                    MD: "Moldavia (+373)",
                    MN: "Mongolia (+976)",
                    MA: "Marruecos (+212)",
                    NP: "Nepal (+977)",
                    NL: "Países Bajos (+31)",
                    NZ: "Nueva Zelanda (+64)",
                    NI: "Nicaragua (+505)",
                    NG: "Nigeria (+234)",
                    NO: "Noruega (+47)",
                    OM: "Omán (+968)",
                    PK: "Pakistán (+92)",
                    PA: "Panamá (+507)",
                    PY: "Paraguay (+595)",
                    PE: "Perú (+51)",
                    PH: "Filipinas (+63)",
                    PL: "Polonia (+48)",
                    PT: "Portugal (+351)",
                    QA: "Catar (+974)",
                    RO: "Rumanía (+40)",
                    RU: "Rusia (+7)",
                    SA: "Arabia Saudita (+966)",
                    RS: "Serbia (+381)",
                    SG: "Singapur (+65)",
                    SK: "Eslovaquia (+421)",
                    SI: "Eslovenia (+386)",
                    ZA: "Sudáfrica (+27)",
                    ES: "España (+34)",
                    LK: "Sri Lanka (+94)",
                    SE: "Suecia (+46)",
                    CH: "Suiza (+41)",
                    SY: "Siria (+963)",
                    TW: "Taiwán (+886)",
                    TH: "Tailandia (+66)",
                    TR: "Turquía (+90)",
                    UA: "Ucrania (+380)",
                    AE: "Emiratos Árabes Unidos (+971)",
                    GB: "Reino Unido (+44)",
                    US: "Estados Unidos (+1)",
                    UY: "Uruguay (+598)",
                    UZ: "Uzbekistán (+998)",
                    VE: "Venezuela (+58)",
                    VN: "Vietnam (+84)",
                    YE: "Yemen (+967)",
                    ZM: "Zambia (+260)",
                    ZW: "Zimbabue (+263)"
                  }}
                />

                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => {
                    setUser({ ...user, phone: e.target.value });
                    validatePhone(`${selectedCode}${e.target.value}`);
                  }}
                  placeholder="Número sin código"
                  className="w-full px-2 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>

            <div>
              <label>{props.address}</label>
              <input
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>}
            </div>



            <div className="relative">
              <label>{props.password}</label>
              <input
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? "ojociego.svg" : "ojoabierto.svg"}
                  alt={showPassword ? "Ojo cerrado" : "Ojo abierto"}
                  className="w-6 h-6"
                />
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
              )}
            </div>




            <div className="relative">
              <label>{props.confirmPassword}</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={user.confirmPassword}
                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border-b border-gray-400 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-sm"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img
                  src={showConfirmPassword ? "ojociego.svg" : "ojoabierto.svg"}
                  alt={showConfirmPassword ? "Ojo cerrado" : "Ojo abierto"}
                  className="w-6 h-6"
                />
              </button>
            </div>



            <button
              type="submit"
              className={`w-full py-2 mt-4 rounded-full text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-pink-400 to-blue-400"
                }`}
              disabled={loading}
            >
              {loading ? "Registrando..." : "REGISTER"}
            </button>

            <div className="text-center text-sm mt-4 p-2">
              <p>{props.text}</p>
              <a href="/Login" className="ml-1 underline font-semibold hover:scale-105 duration-200">
                {props.link}
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
