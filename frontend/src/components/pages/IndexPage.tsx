import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface HomeProps {
  title: string;
  subtitle: string;
}

export default function Home(props: HomeProps) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const letters = props.title.split("");

  return (
    <section
      onClick={() => navigate({ to: "/Login" })}
      className="relative flex h-screen items-center justify-center bg-stone-950 overflow-hidden cursor-pointer "
    style={{ fontFamily: "Montserrat" }}>
      {/* Fondo decorativo */}
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
      />

      {/* Contenido centrado */}
      <div className="relative z-10 text-center text-white select-none flex flex-col items-center">
        {/* Título animado letra por letra */}
        <h1
          className="mb-10 text-9xl text-pink-500 flex gap-1 max-lg:text-7xl max-[30rem]:text-5xl"
          style={{ fontFamily: "Starstruck" }}
        >
          {letters.map((char, i) => (
            <span
              key={i}
              className={`inline-block transition-all duration-1000 ease-out ${animate
                  ? "opacity-100 translate-y-0 scale-100 rotate-0 "
                  : "opacity-0 translate-y-10 scale-50 rotate-12 "
                }`}
              style={{
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        <p
          className={`mt-6 text-lg md:text-2xl transition-all duration-1000 ease-in-out ${animate ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          style={{
            transitionDelay: `${letters.length * 100 + 300}ms`,
          }}
        >
          {props.subtitle}
        </p>
      </div>
    </section>
  );
}
