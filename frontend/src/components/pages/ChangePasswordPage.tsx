import { useState } from "react";
import { axiosRequest } from "../helpers/config";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useToast } from "../ui/Toast";

interface ChangePasswordProps {
    title: string;
    gmail: string;
    old_password: string;
    new_password: string;
    confirmPassword: string;
    buttonText: string;
}

export default function ChangePasswordPage(props: ChangePasswordProps) {

    const { showToast } = useToast();

    const navigate = useNavigate();
    const search = useSearch({ from: "/ChangePassword" as any });
    const { token } = search as { token: string };

    const [gmail, setGmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast("Las contraseñas no coinciden", "error");
            return;
        }

        setLoading(true);

        try {
            const response = await axiosRequest.post("password-getChange", {
                email: gmail,
                old_password: oldPassword,
                token,
                new_password: password,
                password_confirmation: confirmPassword,
            });

            showToast(response.data.message || "Contraseña cambiada con éxito");
            navigate({ to: "/Landing" });
        } catch (error: any) {
            console.error(error);
            showToast(
                error.response?.data?.error || "Error al cambiar la contraseña",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const passwordMatch = () => {
        if (password === confirmPassword || confirmPassword === "" || password === "") { return true }
    }

    return (<section className="relative flex min-h-full items-center justify-center bg-stone-950" style={{ fontFamily: "Montserrat" }}>
        <img
            src="/circles.svg"
            alt="circles background"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="relative z-10 flex lg:w-3/4 max-md:flex-col">
            <div className=" md:flex w-1/2 flex-col items-center justify-center text-center p-8 max-lg:w-full">
                <p className="text-lg text-white max-lg:justify-center">Change your password for</p>
                <h1
                    className="mt-4 text-5xl md:text-7xl text-pink-500"
                    style={{ fontFamily: "Starstruck" }}
                >
                    HARIXOM
                </h1>
            </div>

            <div className="w-full min-xl:w-1/2 bg-gray-200 opacity-90 p-10 flex flex-col justify-center rounded-3xl">
                <h2 className="text-2xl font-bold text-center mb-6 text-black">
                    {props.title}
                </h2>

                <form className="flex flex-col gap-10" onSubmit={handleReset}>
                    <div className="flex flex-col gap-4 pb-4">
                        {/* gmail */}
                        <div className="relative">
                            <label className="block text-sm mb-1 text-gray-700">
                                {props.gmail}
                            </label>
                            <input
                                type="text"
                                value={gmail}
                                onChange={(e) => setGmail(e.target.value)}
                                className="w-full px-3  border-b border-gray-400 bg-transparent focus:outline-none"
                            />
                        </div>

                        {/* aqui van las contrasena vieja */}
                        <div className="relative">
                            <label className="block text-sm mb-1  text-gray-700">
                                {props.old_password}
                            </label>
                            <input
                                type={showOldPassword ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-3  border-b border-gray-400 bg-transparent focus:outline-none"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-4 text-sm"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                            ><img
                                    src={showOldPassword ? "ojociego.svg" : "ojoabierto.svg"}
                                    alt={showOldPassword ? "Ojo cerrado" : "Ojo abierto"}
                                    className="w-6 h-6"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* aqui van las contrasena  */}
                        <div className="relative">
                            <label className="block text-sm mb-1 text-gray-700">
                                {props.new_password}
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 border-b mb-1 border-gray-400 bg-transparent focus:outline-none"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-4 text-sm"
                                onClick={() => setShowPassword(!showPassword)}
                            ><img
                                    src={showPassword ? "ojociego.svg" : "ojoabierto.svg"}
                                    alt={showPassword ? "Ojo cerrado" : "Ojo abierto"}
                                    className="w-6 h-6"
                                />
                            </button>
                            <p className='max-xl:text-sm text-red-600 animate-pulse max-md:text-xs max-[30rem]:text-[0.6rem]'>{passwordMatch() ? '' : 'Password does not match'}</p>
                        </div>

                        {/* aqui van las contrasena de confirmacion */}
                        <div className="relative">
                            <label className="block text-sm mb-1 text-gray-700">
                                {props.confirmPassword}
                            </label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 border-b mb-1 border-gray-400 bg-transparent focus:outline-none"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-4 text-sm"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            ><img
                                    src={showConfirmPassword ? "ojociego.svg" : "ojoabierto.svg"}
                                    alt={showConfirmPassword ? "Ojo cerrado" : "Ojo abierto"}
                                    className="w-6 h-6"
                                />
                            </button>
                            <p className='max-xl:text-sm text-red-600 animate-pulse max-md:text-xs max-[30rem]:text-[0.6rem]'>{passwordMatch() ? '' : 'Password does not match'}</p>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 mt-4 rounded-full text-white font-semibold ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-pink-400 to-blue-400"
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : props.buttonText}
                    </button>
                </form>
                <a href="/Landing" className="mt-4 text-sm underline underline-offset-3 text-pink-400 w-full text-center font-bold">Cancel Password Change</a>
            </div>
        </div >
    </section >
    );

}