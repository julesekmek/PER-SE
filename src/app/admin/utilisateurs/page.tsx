'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function AdminUtilisateursPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.nom || !formData.email || !formData.password) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Vérifier si l'email existe déjà
    const emailExists = users.some(user => 
      user.email === formData.email && user.id !== isEditing
    );
    if (emailExists) {
      setError('Cet email est déjà utilisé');
      return;
    }

    try {
      if (isEditing) {
        // Modification - nous devons créer une API route pour la modification
        const response = await fetch(`/api/users/${isEditing}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSuccess('Utilisateur modifié avec succès');
          loadUsers(); // Recharger la liste
          resetForm();
        } else {
          const data = await response.json();
          setError(data.error || 'Erreur lors de la modification');
        }
      } else {
        // Ajout
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSuccess('Utilisateur ajouté avec succès');
          loadUsers(); // Recharger la liste
          resetForm();
        } else {
          const data = await response.json();
          setError(data.error || 'Erreur lors de l\'ajout');
        }
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
  };

  const handleDelete = async (userId: number) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(`/api/users/${userToDelete}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSuccess('Utilisateur supprimé avec succès');
        loadUsers();
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    }
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const handleEdit = (user: User) => {
    setIsEditing(user.id);
    setIsAdding(false);
    setFormData({
      nom: user.nom,
      email: user.email,
      password: '', // Ne pas afficher le mot de passe
      role: user.role
    });
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      email: '',
      password: '',
      role: 'user'
    });
    setIsEditing(null);
    // Ne pas réinitialiser isAdding ici
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormData({
      nom: '',
      email: '',
      password: '',
      role: 'user'
    });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des Utilisateurs
              </h1>
              <button
                onClick={handleAdd}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                + Ajouter un utilisateur
              </button>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Formulaire */}
            {(isAdding || isEditing) && (
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {isEditing ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 px-3 py-2"
                        placeholder="Ex: Jean Dupont"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 px-3 py-2"
                        placeholder="Ex: jean.dupont@exemple.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mot de passe {isEditing && '(laisser vide pour ne pas changer)'}
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 px-3 py-2"
                        placeholder={isEditing ? "Laissez vide pour ne pas changer" : "Minimum 6 caractères"}
                        required={!isEditing}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Rôle
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                        className="mt-1 block w-full border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 px-3 py-2"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {isEditing ? 'Modifier' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Liste des utilisateurs */}
            <div className="bg-white shadow overflow-visible sm:rounded-md">
              <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.nom.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(user)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            title="Modifier l'utilisateur"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            title="Supprimer l'utilisateur"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

            {/* Modal de confirmation harmonisé */}
            <ConfirmationModal
              isOpen={showDeleteModal}
              onClose={() => { setShowDeleteModal(false); setUserToDelete(null); }}
              onConfirm={confirmDelete}
              title="Supprimer l'utilisateur"
              message={`Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.`}
              confirmText="Supprimer"
              cancelText="Annuler"
              type="danger"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 