import { NextRequest, NextResponse } from 'next/server';
import { getArticles, saveArticles, getArticleById } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    const article = getArticleById(articleId);
    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    const { nom, type, descriptionCourte, descriptionLongue, image, stock, prix } = await request.json();
    const articles = getArticles();
    const articleIndex = articles.findIndex(a => a.id === articleId);

    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le nom existe déjà (sauf pour l'article actuel)
    if (nom && articles.find(a => a.nom === nom && a.id !== articleId)) {
      return NextResponse.json(
        { error: 'Un article avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    // Vérifier le stock
    if (stock !== undefined && stock < 0) {
      return NextResponse.json(
        { error: 'Le stock ne peut pas être négatif' },
        { status: 400 }
      );
    }

    // Vérifier le prix
    if (prix !== undefined && prix < 0) {
      return NextResponse.json(
        { error: 'Le prix ne peut pas être négatif' },
        { status: 400 }
      );
    }

    // Mettre à jour l'article
    articles[articleIndex] = {
      ...articles[articleIndex],
      nom: nom || articles[articleIndex].nom,
      type: type || articles[articleIndex].type,
      descriptionCourte: descriptionCourte || articles[articleIndex].descriptionCourte,
      descriptionLongue: descriptionLongue || articles[articleIndex].descriptionLongue,
      image: image || articles[articleIndex].image,
      stock: stock !== undefined ? stock : articles[articleIndex].stock,
      prix: prix !== undefined ? prix : articles[articleIndex].prix
    };

    const success = saveArticles(articles);
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde' },
        { status: 500 }
      );
    }

    return NextResponse.json(articles[articleIndex]);

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: 'ID invalide' },
        { status: 400 }
      );
    }

    const articles = getArticles();
    const articleIndex = articles.findIndex(a => a.id === articleId);

    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    articles.splice(articleIndex, 1);
    const success = saveArticles(articles);

    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 