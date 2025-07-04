import fs from 'fs';
import path from 'path';
import { User, Article } from '@/types';
import { generateId, isValidEmail } from './utils';

const dataDir = path.join(process.cwd(), 'src/app/data');

// Vérifier que nous sommes côté serveur
const isServer = typeof window === 'undefined';

/**
 * Vérifie si le répertoire de données existe
 */
function ensureDataDir(): void {
  if (!isServer) return;
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

/**
 * Lit un fichier JSON de manière sécurisée
 */
function readJsonFile<T>(filePath: string): T[] {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  try {
    ensureDataDir();
    
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    if (!Array.isArray(data)) {
      console.error(`Le fichier ${filePath} ne contient pas un tableau valide`);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return [];
  }
}

/**
 * Écrit un fichier JSON de manière sécurisée
 */
function writeJsonFile<T>(filePath: string, data: T[]): boolean {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Erreur lors de l'écriture du fichier ${filePath}:`, error);
    return false;
  }
}

// Fonction pour lire les utilisateurs
export function getUsers(): User[] {
  const filePath = path.join(dataDir, 'users.json');
  return readJsonFile<User>(filePath);
}

// Fonction pour écrire les utilisateurs
export function saveUsers(users: User[]): boolean {
  const filePath = path.join(dataDir, 'users.json');
  return writeJsonFile<User>(filePath, users);
}

// Fonction pour lire les articles
export function getArticles(): Article[] {
  const filePath = path.join(dataDir, 'articles.json');
  return readJsonFile<Article>(filePath);
}

// Fonction pour écrire les articles
export function saveArticles(articles: Article[]): boolean {
  const filePath = path.join(dataDir, 'articles.json');
  return writeJsonFile<Article>(filePath, articles);
}

// Fonction pour authentifier un utilisateur
export function authenticateUser(email: string, password: string): User | null {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  if (!email || !password) {
    return null;
  }
  
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
}

// Fonction pour obtenir un utilisateur par ID
export function getUserById(id: number): User | null {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

// Fonction pour obtenir un article par ID
export function getArticleById(id: number): Article | null {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  const articles = getArticles();
  return articles.find(a => a.id === id) || null;
}

// Fonction pour créer un nouvel utilisateur
export function createUser(userData: Omit<User, 'id'>): User | null {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  if (!isValidEmail(userData.email)) {
    throw new Error('Email invalide');
  }
  
  const users = getUsers();
  
  // Vérifier si l'email existe déjà
  if (users.some(u => u.email === userData.email)) {
    throw new Error('Cet email est déjà utilisé');
  }
  
  const newUser: User = {
    ...userData,
    id: generateId(users),
  };
  
  users.push(newUser);
  
  if (saveUsers(users)) {
    return newUser;
  }
  
  return null;
}

// Fonction pour mettre à jour un utilisateur
export function updateUser(id: number, updates: Partial<Omit<User, 'id'>>): User | null {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  // Vérifier si l'email existe déjà (sauf pour l'utilisateur actuel)
  if (updates.email && users.some(u => u.email === updates.email && u.id !== id)) {
    throw new Error('Cet email est déjà utilisé');
  }
  
  const updatedUser: User = {
    ...users[userIndex],
    ...updates,
    id, // S'assurer que l'ID ne change pas
  };
  
  users[userIndex] = updatedUser;
  
  if (saveUsers(users)) {
    return updatedUser;
  }
  
  return null;
}

// Fonction pour supprimer un utilisateur
export function deleteUser(id: number): boolean {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== id);
  
  if (filteredUsers.length === users.length) {
    return false; // Utilisateur non trouvé
  }
  
  return saveUsers(filteredUsers);
}

// Fonction pour créer un nouvel article
export function createArticle(articleData: Omit<Article, 'id'>): Article | null {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  const articles = getArticles();
  
  const newArticle: Article = {
    ...articleData,
    id: generateId(articles),
  };
  
  articles.push(newArticle);
  
  if (saveArticles(articles)) {
    return newArticle;
  }
  
  return null;
}

// Fonction pour mettre à jour un article
export function updateArticle(id: number, updates: Partial<Omit<Article, 'id'>>): Article | null {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  const articles = getArticles();
  const articleIndex = articles.findIndex(a => a.id === id);
  
  if (articleIndex === -1) {
    return null;
  }
  
  const updatedArticle: Article = {
    ...articles[articleIndex],
    ...updates,
    id, // S'assurer que l'ID ne change pas
  };
  
  articles[articleIndex] = updatedArticle;
  
  if (saveArticles(articles)) {
    return updatedArticle;
  }
  
  return null;
}

// Fonction pour supprimer un article
export function deleteArticle(id: number): boolean {
  if (!isServer) {
    throw new Error('Cette fonction ne peut être appelée que côté serveur');
  }
  
  const articles = getArticles();
  const filteredArticles = articles.filter(a => a.id !== id);
  
  if (filteredArticles.length === articles.length) {
    return false; // Article non trouvé
  }
  
  return saveArticles(filteredArticles);
} 