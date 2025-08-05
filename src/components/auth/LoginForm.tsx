import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Coffee, Mail, Lock } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      addToast('¡Bienvenido al sistema!', 'success');
    } else {
      addToast('Credenciales incorrectas. Verifica tu email y contraseña.', 'error');
    }
  };

  const demoAccounts = [
    { email: 'usuario@ciclobasico.com', role: 'Estudiante Ciclo Básico' },
    { email: 'usuario@ciclosuperior.com', role: 'Estudiante Ciclo Superior' },
    { email: 'usuario@kiosquero.com', role: 'Encargado del Kiosco' },
    { email: 'usuario@admin.com', role: 'Administrador' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
              <Coffee className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Kiosco Escolar</h1>
            <p className="text-gray-600">Sistema de Pedidos Online</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Ingresa tu email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner size="sm" color="text-white" /> : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Cuentas de demostración:</h3>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('demo123');
                  }}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">{account.role}</div>
                  <div className="text-xs text-gray-600">{account.email}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Contraseña para todas las cuentas: <strong>demo123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};