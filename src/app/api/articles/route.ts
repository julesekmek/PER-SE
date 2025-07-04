import { NextRequest, NextResponse } from 'next/server';
import { getArticles, saveArticles } from '@/lib/data';
import { generateId } from '@/lib/utils';
import { Article } from '@/types';

export async function GET() {
  try {
    const articles = getArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const articleData = await request.json();
    const articles = getArticles();

    // Validation
    if (!articleData.nom || !articleData.type || !articleData.descriptionCourte || !articleData.descriptionLongue) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    if (articleData.stock < 0) {
      return NextResponse.json(
        { error: 'Le stock ne peut pas être négatif' },
        { status: 400 }
      );
    }

    if (articleData.prix < 0) {
      return NextResponse.json(
        { error: 'Le prix ne peut pas être négatif' },
        { status: 400 }
      );
    }

    const newArticle: Article = {
      id: generateId(articles),
      ...articleData
    };

    articles.push(newArticle);

    if (saveArticles(articles)) {
      return NextResponse.json(newArticle, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 