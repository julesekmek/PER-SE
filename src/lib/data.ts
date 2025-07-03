import fs from 'fs';
import path from 'path';
import { User, Article } from '@/types';

const dataDir = path.join(process.cwd(), 'src/app/data');

// Vérifier que nous sommes côté serveur
const isServer = typeof window === 'undefined';

// Fonction pour lire les utilisateurs
export function getUsers(): User[] {
  if (!isServer) {
    console.warn('getUsers appelé côté client');
    return [];
  }
  
  try {
    const filePath = path.join(dataDir, 'users.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Erreur lors de la lecture des utilisateurs:', error);
    return [];
  }
}

// Fonction pour écrire les utilisateurs
export function saveUsers(users: User[]): boolean {
  if (!isServer) {
    console.warn('saveUsers appelé côté client');
    return false;
  }
  
  try {
    const filePath = path.join(dataDir, 'users.json');
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'écriture des utilisateurs:', error);
    return false;
  }
}

// Fonction pour lire les articles
export function getArticles(): Article[] {
  if (!isServer) {
    console.warn('getArticles appelé côté client');
    return [];
  }
  
  try {
    const filePath = path.join(dataDir, 'articles.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Erreur lors de la lecture des articles:', error);
    return [];
  }
}

// Fonction pour écrire les articles
export function saveArticles(articles: Article[]): boolean {
  if (!isServer) {
    console.warn('saveArticles appelé côté client');
    return false;
  }
  
  try {
    const filePath = path.join(dataDir, 'articles.json');
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'écriture des articles:', error);
    return false;
  }
}

// Fonction pour authentifier un utilisateur
export function authenticateUser(email: string, password: string): User | null {
  if (!isServer) {
    console.warn('authenticateUser appelé côté client');
    return null;
  }
  
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
}

// Fonction pour obtenir un utilisateur par ID
export function getUserById(id: number): User | null {
  if (!isServer) {
    console.warn('getUserById appelé côté client');
    return null;
  }
  
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

// Fonction pour obtenir un article par ID
export function getArticleById(id: number): Article | null {
  if (!isServer) {
    console.warn('getArticleById appelé côté client');
    return null;
  }
  
  const articles = getArticles();
  return articles.find(a => a.id === id) || null;
}

// Fonction pour générer un nouvel ID
export function generateId(items: any[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
} 