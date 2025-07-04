import { NextRequest, NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/data';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, email, password, userId } = body;

    // Validation des données requises
    if (!nom || !email || !userId) {
      return NextResponse.json(
        { error: 'Nom et email sont obligatoires' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'email existe déjà (sauf pour l'utilisateur en cours de modification)
    const emailExists = users.some(user => 
      user.email === email && user.id !== userId
    );
    if (emailExists) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé par un autre utilisateur' },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    const updatedUser = {
      ...users[userIndex],
      nom: nom.trim(),
      email: email.trim().toLowerCase(),
      // Ne mettre à jour le mot de passe que s'il est fourni et non vide
      ...(password && password.trim() && { password: password.trim() })
    };

    users[userIndex] = updatedUser;
    
    if (saveUsers(users)) {
      // Retourner l'utilisateur sans le mot de passe pour des raisons de sécurité
      const { password: _, ...userWithoutPassword } = updatedUser;
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: 'Profil mis à jour avec succès'
      });
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde des modifications' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la modification du profil:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 