import { NextRequest, NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/data';
import { generateId } from '@/lib/utils';
import { User } from '@/types';

export async function GET() {
  try {
    const users = getUsers();
    // Ne pas renvoyer les mots de passe
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    
    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const users = getUsers();

    // Validation
    if (!userData.nom || !userData.email || !userData.password) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    if (userData.password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: generateId(users),
      ...userData
    };

    users.push(newUser);

    if (saveUsers(users)) {
      const { password, ...userWithoutPassword } = newUser;
      return NextResponse.json(userWithoutPassword, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 