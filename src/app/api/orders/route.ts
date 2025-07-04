import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Order, Article } from '@/types';

const ordersFilePath = path.join(process.cwd(), 'src/app/data/orders.json');
const articlesFilePath = path.join(process.cwd(), 'src/app/data/articles.json');

// Fonction utilitaire pour lire les commandes
async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ordersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, retourner un tableau vide
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Fonction utilitaire pour écrire les commandes
async function writeOrders(orders: Order[]): Promise<void> {
  await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
}

// Fonction utilitaire pour lire les articles
async function readArticles(): Promise<Article[]> {
  try {
    const data = await fs.readFile(articlesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Fonction utilitaire pour écrire les articles
async function writeArticles(articles: Article[]): Promise<void> {
  await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');
}

// Fonction pour valider et mettre à jour les stocks
async function validateAndUpdateStock(orderArticles: any[]): Promise<{ success: boolean; error?: string }> {
  try {
    const articles = await readArticles();
    const stockErrors: string[] = [];
    const articlesToUpdate: Article[] = [];

    // Vérifier le stock pour chaque article
    for (const orderArticle of orderArticles) {
      const article = articles.find(a => a.id === orderArticle.articleId);
      if (!article) {
        return { success: false, error: `Article ${orderArticle.articleId} non trouvé` };
      }

      if (orderArticle.quantity > article.stock) {
        stockErrors.push(`${article.nom}: quantité demandée (${orderArticle.quantity}) > stock disponible (${article.stock})`);
      } else {
        // Mettre à jour le stock
        const updatedArticle = {
          ...article,
          stock: article.stock - orderArticle.quantity
        };
        articlesToUpdate.push(updatedArticle);
      }
    }

    if (stockErrors.length > 0) {
      return { 
        success: false, 
        error: `Stock insuffisant pour: ${stockErrors.join(', ')}` 
      };
    }

    // Mettre à jour tous les articles
    const updatedArticles = articles.map(article => {
      const updatedArticle = articlesToUpdate.find(a => a.id === article.id);
      return updatedArticle || article;
    });

    await writeArticles(updatedArticles);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la validation/mise à jour du stock:', error);
    return { success: false, error: 'Erreur lors de la gestion du stock' };
  }
}

// Fonction utilitaire pour générer un nouvel ID de commande unique
function generateOrderId(orders: Order[]): string {
  const currentYear = new Date().getFullYear();
  const yearOrders = orders.filter(order => order.id && order.id.startsWith(`CMD-${currentYear}-`));
  
  // Cherche le plus grand numéro déjà utilisé
  const maxNum = yearOrders.reduce((max, order) => {
    const match = order.id.match(/^CMD-\d{4}-(\d{3})$/);
    if (match) {
      const num = parseInt(match[1], 10);
      return num > max ? num : max;
    }
    return max;
  }, 0);
  
  const nextNumber = maxNum + 1;
  const newId = `CMD-${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
  
  // Vérification supplémentaire : s'assurer que l'ID n'existe pas déjà
  if (orders.some(order => order.id === newId)) {
    // Si par hasard l'ID existe déjà, on incrémente jusqu'à trouver un ID libre
    let counter = nextNumber + 1;
    while (orders.some(order => order.id === `CMD-${currentYear}-${counter.toString().padStart(3, '0')}`)) {
      counter++;
    }
    return `CMD-${currentYear}-${counter.toString().padStart(3, '0')}`;
  }
  
  return newId;
}

// GET - Récupérer toutes les commandes
export async function GET() {
  try {
    const orders = await readOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Erreur lors de la lecture des commandes:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des commandes' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour des commandes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Si c'est une nouvelle commande (avec validation de stock)
    if (body.type === 'new_order' && body.order) {
      let { order } = body;
      // Charger les commandes existantes
      const existingOrders = await readOrders();
      
      // Générer un ID unique si absent
      if (!order.id) {
        order.id = generateOrderId(existingOrders);
      } else {
        // Vérifier l'unicité de l'ID
        if (existingOrders.some(o => o.id === order.id)) {
          return NextResponse.json(
            { error: `ID de commande déjà existant: ${order.id}` },
            { status: 400 }
          );
        }
      }
      
      // Vérification finale : s'assurer qu'aucun doublon n'a été créé
      if (existingOrders.some(o => o.id === order.id)) {
        return NextResponse.json(
          { error: `Erreur interne : ID de commande en conflit: ${order.id}` },
          { status: 500 }
        );
      }
      // Validation de la commande
      if (!order.id || !order.userId || !order.date || !Array.isArray(order.articles)) {
        return NextResponse.json(
          { error: 'Format de commande invalide' },
          { status: 400 }
        );
      }
      // Valider et mettre à jour le stock
      const stockValidation = await validateAndUpdateStock(order.articles);
      if (!stockValidation.success) {
        return NextResponse.json(
          { error: stockValidation.error },
          { status: 400 }
        );
      }
      // Ajouter la nouvelle commande
      const updatedOrders = [...existingOrders, order];
      await writeOrders(updatedOrders);
      return NextResponse.json({ success: true, order });
    }
    
    // Si c'est une mise à jour de commandes existantes (sans validation de stock)
    if (Array.isArray(body)) {
      // Validation de chaque commande
      for (const order of body) {
        if (!order.id || !order.userId || !order.date || !Array.isArray(order.articles)) {
          return NextResponse.json(
            { error: 'Format de commande invalide' },
            { status: 400 }
          );
        }
      }

      await writeOrders(body);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Format de requête invalide' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des commandes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des commandes' },
      { status: 500 }
    );
  }
} 