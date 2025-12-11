// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "admin") {
      router.push("/admin/dashboard");
    }
  };

  const handleStudentAccess = () => {
    router.push("/student/rooms");
  };

  return (
    <>
      <title>Authentification | Digital Campus</title>
      <meta name="description" content="Connecter pour accéder à l'outil." />

      <main className="min-h-screen bg-[#0092bd] flex items-center justify-center p-4" role="main">
        <div className="w-full max-w-md">
          <section aria-labelledby="login-header" className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-[#0092bd] rounded-2xl p-4 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Calque_2"
                  viewBox="0 0 561.27 561.27"
                  className="w-16 h-16"
                  role="img"
                  aria-label="Logo Digital Campus"
                >
                  <g id="LOGO_COMPLET">
                    <path
                      id="blanc"
                      d="M274.34,91.46l-.02,378.39h-91.45l.02-378.39h91.45Zm-182.87,0h91.42V0H.02l-.02,561.27H182.87v-91.42H91.45l.02-378.39Zm274.31,469.81l-.02-561.27h195.47V91.46h-104.02l-.02,378.39h104.02v91.42h-195.47Z"
                      fill="#fff"
                    />
                  </g>
                </svg>
              </div>
              <h1 id="login-header" className="text-[#1A1A1A] text-center">
                Digital Campus
              </h1>
              <p className="text-[#5F6368] text-center mt-2">
                Surveillance des salles en temps réel
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="login-form">
              <h2 id="login-form" className="sr-only">Connexion administrateur</h2>
              <div>
                <label htmlFor="username" className="block text-[#1A1A1A] mb-2">
                  Nom d&apos;utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5F6368]" aria-hidden="true" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent"
                    placeholder="admin"
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-[#1A1A1A] mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5F6368]" aria-hidden="true" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent"
                    placeholder="••••••••"
                    aria-required="true"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0092bd] text-white py-3 rounded-lg hover:bg-[#007a9d] transition-colors duration-200 cursor-pointer"
                aria-label="Se connecter en tant qu'administrateur"
              >
                Connexion
              </button>
            </form>

            {/* Student Access */}
            <section aria-labelledby="student-access" className="mt-8 pt-6 border-t border-gray-200">
              <h2 id="student-access" className="sr-only">Accès étudiant</h2>
              <p className="text-[#5F6368] text-center mb-3">
                Vous êtes étudiant ?
              </p>
              <button
                onClick={handleStudentAccess}
                className="w-full border-2 border-[#0092bd] text-[#0092bd] py-3 rounded-lg hover:bg-[#0092bd] hover:text-white transition-all duration-200 cursor-pointer"
                aria-label="Accès étudiant en lecture seule"
              >
                Accès sans authentification
              </button>
              <p className="text-[#5F6368] text-center mt-2 text-sm">
                (Lecture seule)
              </p>
            </section>
          </section>

          {/* Demo Info */}
          <div className="mt-6 text-center text-white/90 text-sm" aria-live="polite">
            <p>Demo: admin / admin</p>
          </div>
        </div>
      </main>
    </>
  );
}