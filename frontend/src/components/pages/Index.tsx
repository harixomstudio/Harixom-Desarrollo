import type React from "react";
import { useNavigate } from "@tanstack/react-router";

interface HomeProps {
  title: string;
  subtitle: string;
}

export default function Home(props: HomeProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: "/Login" });
  };

  return (
    <section
      onClick={handleClick}
      className="relative flex min-h-screen items-center justify-center bg-stone-950 overflow-hidden cursor-pointer"
    >
      
      <img
        src="/circles.svg"
        alt="circles background"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
      />

      <div className="relative z-10 text-center text-white select-none">
  <p className="text-lg md:text-2xl">{props.subtitle}</p>
  <h1
    className="mt-4 text-5xl md:text-7xl text-pink-500"
    style={{ fontFamily: 'Starstruck' }}
  >
    {props.title}
  </h1>
</div>
    </section>
  );
}
