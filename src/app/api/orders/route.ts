import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Order } from '@/types';

const ordersFilePath = path.join(process.cwd(), 'src/app/data/orders.json');

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
    const orders: Order[] = await request.json();
    
    // Validation basique des données
    if (!Array.isArray(orders)) {
      return NextResponse.json(
        { error: 'Les données doivent être un tableau de commandes' },
        { status: 400 }
      );
    }

    // Validation de chaque commande
    for (const order of orders) {
      if (!order.id || !order.userId || !order.date || !Array.isArray(order.articles)) {
        return NextResponse.json(
          { error: 'Format de commande invalide' },
          { status: 400 }
        );
      }
    }

    await writeOrders(orders);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des commandes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des commandes' },
      { status: 500 }
    );
  }
} 