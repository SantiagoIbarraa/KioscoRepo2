import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ExpandableNavigation } from './ExpandableNavigation';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Package, DollarSign, TrendingUp, Clock } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteProduct: 'N/A',
    lastOrder: null as string | null
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+54 9 11 1234-5678',
    address: 'Av. Corrientes 1234, CABA',
    birthDate: '2005-03-15',
    course: user?.role === 'ciclo_basico' ? '3° Año' : '5° Año',
    emergencyContact: 'María García - +54 9 11 8765-4321'
  });

  useEffect(() => {
    // Calculate real order statistics from localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = allOrders.filter((order: any) => order.userId === user?.id);
    
    if (userOrders.length > 0) {
      const totalOrders = userOrders.length;
      const totalSpent = userOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
      
      // Find most ordered product
      const productCounts: { [key: string]: number } = {};
      userOrders.forEach((order: any) => {
        order.items.forEach((item: any) => {
          const productName = item.product.name;
          productCounts[productName] = (productCounts[productName] || 0) + item.quantity;
        });
      });
      
      const favoriteProduct = Object.keys(productCounts).length > 0 
        ? Object.entries(productCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0][0]
        : 'N/A';
      
      const lastOrder = userOrders.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]?.createdAt || null;
      
      setOrderStats({
        totalOrders,
        totalSpent,
        favoriteProduct,
        lastOrder
      });
    }
  }, [user]);

  const handleSave = () => {
    // Simulate saving profile data
    addToast('Perfil actualizado correctamente', 'success');
    setIsEditing(false);
    
    // In a real app, you would save to the database here
    // For demo purposes, we'll just update localStorage
    const updatedUser = { ...user, name: formData.name };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+54 9 11 1234-5678',
      address: 'Av. Corrientes 1234, CABA',
      birthDate: '2005-03-15',
      course: user?.role === 'ciclo_basico' ? '3° Año' : '5° Año',
      emergencyContact: 'María García - +54 9 11 8765-4321'
    });
    setIsEditing(false);
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ciclo_basico':
        return 'Estudiante Ciclo Básico';
      case 'ciclo_superior':
        return 'Estudiante Ciclo Superior';
      default:
        return role;
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-cream-50 pl-16">
      {/* Expandable Navigation */}
      <ExpandableNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              <span>Editar</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Guardar</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                    <p className="text-gray-600">{getRoleText(user?.role || '')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{formData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{formData.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{formData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{new Date(formData.birthDate).toLocaleDateString('es-AR')}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{formData.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Académica</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="1° Año">1° Año</option>
                      <option value="2° Año">2° Año</option>
                      <option value="3° Año">3° Año</option>
                      <option value="4° Año">4° Año</option>
                      <option value="5° Año">5° Año</option>
                      <option value="6° Año">6° Año</option>
                    </select>
                  ) : (
                    <span className="text-gray-900">{formData.course}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciclo
                  </label>
                  <span className="text-gray-900 capitalize">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contacto de Emergencia
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nombre - Teléfono"
                    />
                  ) : (
                    <span className="text-gray-900">{formData.emergencyContact}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas de Pedidos</h2>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <Package className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary-600">{orderStats.totalOrders}</div>
                  <div className="text-sm text-gray-600">Pedidos Realizados</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{formatPrice(orderStats.totalSpent)}</div>
                  <div className="text-sm text-gray-600">Total Gastado</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    <div className="text-sm text-gray-600">Producto Favorito</div>
                  </div>
                  <div className="font-medium text-blue-600">{orderStats.favoriteProduct}</div>
                </div>

                {orderStats.lastOrder && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-purple-600 mr-2" />
                      <div className="text-sm text-gray-600">Último Pedido</div>
                    </div>
                    <div className="font-medium text-purple-600">
                      {new Date(orderStats.lastOrder).toLocaleDateString('es-AR')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
              
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/orders'}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-gray-900">Ver Historial Completo</div>
                  <div className="text-sm text-gray-600">Todos tus pedidos anteriores</div>
                </button>

                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Configurar Notificaciones</div>
                  <div className="text-sm text-gray-600">Personaliza tus alertas</div>
                </button>

                <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Ayuda y Soporte</div>
                  <div className="text-sm text-gray-600">¿Necesitas ayuda?</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};