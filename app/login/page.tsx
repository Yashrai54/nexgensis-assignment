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
    <div className="flex gap-50 bg-black">
      <div>
        <img
          src={image.src}
          alt="Login"
          className="h-screen w-full"
        />

        <div className="fixed bottom-[30%] left-[-50px] h-[300px] w-[300px] rounded-full bg-[#1b4597]" />
      </div>

      <div className="relative flex flex-col items-center justify-center gap-10">
        <h1 className="mb-2 font-mono text-6xl text-white">
          LOGIN
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-10"
        >
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-[500px] rounded-md border border-white px-5 py-5 font-mono text-white"
            placeholder="Enter username"
            required
          />

          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-[500px] rounded-md border border-white px-5 py-5 font-mono text-white"
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
            className="w-[500px] bg-yellow-500 py-3 font-mono text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

