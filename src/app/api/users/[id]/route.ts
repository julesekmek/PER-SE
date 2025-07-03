import { NextRequest, NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/data';

interface UserDetailParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: UserDetailParams) {
  try {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID utilisateur invalide' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { nom, email, password, role } = body;

    // Validation
    if (!nom || !email || !role) {
      return NextResponse.json(
        { error: 'Nom, email et rôle sont obligatoires' },
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
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    const updatedUser = {
      ...users[userIndex],
      nom,
      email,
      role,
      // Ne mettre à jour le mot de passe que s'il est fourni
      ...(password && { password })
    };

    users[userIndex] = updatedUser;
    
    if (saveUsers(users)) {
      return NextResponse.json(updatedUser);
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la modification de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: UserDetailParams) {
  try {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID utilisateur invalide' },
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

    // Supprimer l'utilisateur
    users.splice(userIndex, 1);
    
    if (saveUsers(users)) {
      return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 