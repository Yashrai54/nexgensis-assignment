"use client";

import { login } from "@/api/auth";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import image from "../assets/image.png";

const LoginPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    setError("");
    setLoading(true);

    try {
      const data = await login(username, password);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      router.push("/products");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-black md:flex-row md:gap-20 lg:gap-50">
      <div className="relative hidden md:block md:w-1/2 lg:w-auto">
        <img
          src={image.src}
          alt="Login"
          className="h-screen w-full object-cover"
        />

        <div className="fixed bottom-[30%] left-[-50px] h-[300px] w-[300px] rounded-full bg-[#1b4597]" />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-4 py-10 sm:gap-10 sm:px-6">
        <h1 className="mb-2 font-mono text-4xl text-white sm:text-5xl md:text-6xl">
          LOGIN
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[500px] flex-col gap-6 sm:gap-10"
        >
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-md border border-white px-5 py-4 font-mono text-white sm:py-5"
            placeholder="Enter username"
            required
          />

          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-white px-5 py-4 font-mono text-white sm:py-5"
            placeholder="Enter password"
            required
          />

          {error && (
            <p className="font-mono text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 py-3 font-mono text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;