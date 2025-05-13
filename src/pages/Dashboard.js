// src/pages/Dashboard.js
import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import { toast } from 'react-toastify';
import { listBooks, createBook, deleteBook, updateBook } from '../api/bookApi'; 
import './Dashboard.css'; 

function BookForm({ onSubmit, initialData = null, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [value, setValue] = useState(initialData?.value || '');
  const [rating, setRating] = useState(initialData?.rating || '');
  const [analysis, setAnalysis] = useState(initialData?.analysis || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ title, author, value: Number(value), rating: Number(rating), analysis });
      if (!initialData) {
        setTitle(''); setAuthor(''); setValue(''); setRating(''); setAnalysis('');
      }
    } catch (error) {
      console.error('BookForm internal submit error (should be handled by parent):', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h3>{initialData ? 'Editar Livro' : 'Adicionar Novo Livro'}</h3>
      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="form-group">
        <label htmlFor="author">Autor</label>
        <input id="author" type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="form-group">
        <label htmlFor="value">Valor (R$)</label>
        <input id="value" type="number" step="0.01" min="0" value={value} onChange={(e) => setValue(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="form-group">
        <label htmlFor="rating">Nota (1-10)</label>
        <input id="rating" type="number" min="1" max="10" value={rating} onChange={(e) => setRating(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="form-group">
        <label htmlFor="analysis">Análise</label>
        <textarea id="analysis" value={analysis} onChange={(e) => setAnalysis(e.target.value)} required disabled={isLoading} />
      </div>
      <div className="form-actions">
        <button type="submit" className="button-primary" disabled={isLoading}>
          {isLoading ? (initialData ? 'Salvando...' : 'Adicionando...') : (initialData ? 'Salvar Alterações' : 'Adicionar Livro')}
        </button>
        {onCancel && <button type="button" className="button-secondary" onClick={onCancel} disabled={isLoading}>Cancelar</button>}
      </div>
    </form>
  );
}


export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // Para controlar a visibilidade do formulário
  const [editingBook, setEditingBook] = useState(null); // Para guardar o livro que está sendo editado

  const token = getToken(); 

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        console.warn("Dashboard: Tentativa de buscar livros sem token.");
        toast.error("Autenticação necessária para ver os livros.");
        return;
      }
      const data = await listBooks(token);
      setBooks(data);
    } catch (err) {
      console.error('Dashboard: Erro ao carregar livros:', err);
      toast.error(err.message || 'Falha ao carregar seus livros.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCreateBook = async (bookData) => {
    try {
      const newBook = await createBook(bookData, token);
      setBooks([newBook, ...books]);
      toast.success('Livro adicionado com sucesso!');
      setShowForm(false);
    } catch (err) {
      console.error('Dashboard: Erro ao criar livro:', err, { bookData });
      toast.error(err.message || 'Falha ao adicionar o livro.');
    }
  };

  const handleUpdateBook = async (bookData) => {
    if (!editingBook) return;
    try {
      const updatedBook = await updateBook(editingBook._id, bookData, token);
      setBooks(books.map(b => b._id === editingBook._id ? updatedBook : b));
      toast.success('Livro atualizado com sucesso!');
      setEditingBook(null);
      setShowForm(false);
    } catch (err) {
      console.error('Dashboard: Erro ao atualizar livro:', err, { bookId: editingBook._id, bookData });
      toast.error(err.message || 'Falha ao atualizar o livro.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Tem certeza que deseja deletar este livro?')) {
      try {
        await deleteBook(bookId, token);
        setBooks(books.filter((book) => book._id !== bookId));
        toast.success('Livro deletado com sucesso!');
      } catch (err) {
        console.error('Dashboard: Erro ao deletar livro:', err, { bookId });
        toast.error(err.message || 'Falha ao deletar o livro.');
      }
    }
  };

  const openEditForm = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const openCreateForm = () => {
    setEditingBook(null); 
    setShowForm(true);
  };


  if (isLoading) {
    return <div className="loading-message">Carregando seus livros...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Meus Livros</h2>
        <button onClick={openCreateForm} className="button-primary">
          Adicionar Novo Livro
        </button>
      </header>

      {showForm && (
        <div className="modal-form"> {/* Você pode estilizar isso como um modal */}
          <BookForm
            onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
            initialData={editingBook}
            onCancel={() => { setShowForm(false); setEditingBook(null); }}
          />
        </div>
      )}

      {books.length > 0 ? (
        <ul className="items-list">
          {books.map((book) => (
            <li key={book._id} className="item-card"> {/* Assumindo que o ID é `_id` */}
              <h3>{book.title}</h3>
              <p><strong>Autor:</strong> {book.author}</p>
              <p><strong>Preço:</strong> R$ {book.value?.toFixed(2)}</p>
              <p><strong>Nota:</strong> {book.rating}/10</p>
              <p><strong>Análise:</strong> {book.analysis}</p>
              <p className="item-timestamps">
                <small>Criado em: {new Date(book.createdAt).toLocaleDateString()}</small><br/>
                <small>Atualizado em: {new Date(book.updatedAt).toLocaleDateString()}</small>
              </p>
              <div className="item-actions">
                <button onClick={() => openEditForm(book)} className="button-secondary">Editar</button>
                <button onClick={() => handleDeleteBook(book._id)} className="button-danger">Deletar</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !showForm && <p className="empty-message">Nenhum livro cadastrado ainda. Que tal adicionar um?</p>
      )}
    </div>
  );
}