import React, { useState } from "react";
import CompanyAuth from "./../components/CompanyAuth";
import StudentAuth from "./../components/StudentAuth";
import Modal from "./../components/Modal";

const Home = () => {
  const [showCompanyAuth, setShowCompanyAuth] = useState(false);
  const [showStudentAuth, setShowStudentAuth] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="bg-slate-900/60 backdrop-blur-lg border-b border-slate-800 p-6 flex items-center justify-between fixed w-full z-50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          JobBoard
        </h1>
        <nav className="space-x-8">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Jobs
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </a>
        </nav>
      </header>

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/0 to-slate-900/0" />
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-7xl font-extrabold mb-8 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent animate-gradient">
                Find Your Dream Job
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                Connect with top companies and unlock your career potential in
                the modern job market
              </p>
              <div className="flex gap-6 justify-center">
                <button
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-semibold overflow-hidden shadow-xl transition-all hover:scale-105"
                  onClick={() => setShowCompanyAuth(true)}
                >
                  <span className="absolute inset-0 bg-white/30 group-hover:scale-x-100 scale-x-0 origin-left transition-transform"></span>
                  <span className="relative">Company Portal</span>
                </button>
                <button
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white font-semibold overflow-hidden shadow-xl transition-all hover:scale-105"
                  onClick={() => setShowStudentAuth(true)}
                >
                  <span className="absolute inset-0 bg-white/30 group-hover:scale-x-100 scale-x-0 origin-left transition-transform"></span>
                  <span className="relative">Student Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700">
              <div className="text-indigo-400 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Smart Matching
              </h3>
              <p className="text-gray-400">
                AI-powered job matching for perfect career fits
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700">
              <div className="text-indigo-400 text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Quick Apply
              </h3>
              <p className="text-gray-400">
                One-click applications to streamline your job search
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-lg border border-slate-700">
              <div className="text-indigo-400 text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Verified Companies
              </h3>
              <p className="text-gray-400">
                Connect with authenticated employers you can trust
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Modal isOpen={showCompanyAuth} onClose={() => setShowCompanyAuth(false)}>
        <CompanyAuth onClose={() => setShowCompanyAuth(false)} />
      </Modal>

      <Modal isOpen={showStudentAuth} onClose={() => setShowStudentAuth(false)}>
        <StudentAuth onClose={() => setShowStudentAuth(false)} />
      </Modal>

      <footer className="bg-slate-900/60 backdrop-blur-lg border-t border-slate-800 p-8 text-center">
        <p className="text-gray-400">
          © 2023 JobBoard. Building futures, one job at a time.
        </p>
      </footer>
    </div>
  );
};

export default Home;
