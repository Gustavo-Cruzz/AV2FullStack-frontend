const API_URL = 'https://av-2-full-stack.vercel.app/api';

const getAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const listBooks = async (token) => {
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao buscar livros.' }));
      console.error('API List Books Error:', { status: response.status, errorData });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('List books request failed:', error);
    throw error;
  }
};

export const createBook = async (bookData, token) => {
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(bookData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao criar livro.' }));
      console.error('API Create Book Error:', { status: response.status, errorData, requestBody: bookData });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Create book request failed:', error);
    throw error;
  }
};

export const getBookById = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao buscar livro por ID.' }));
      console.error('API Get Book By ID Error:', { status: response.status, errorData, bookId: id });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Get book by ID request failed:', error);
    throw error;
  }
};

export const updateBook = async (id, bookData, token) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(bookData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao atualizar livro.' }));
      console.error('API Update Book Error:', { status: response.status, errorData, bookId: id, requestBody: bookData });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Update book request failed:', error);
    throw error;
  }
};

export const deleteBook = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao deletar livro.' }));
      console.error('API Delete Book Error:', { status: response.status, errorData, bookId: id });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
      return { message: 'Livro deletado com sucesso' };
    }
    return response.json();
  } catch (error) {
    console.error('Delete book request failed:', error);
    throw error;
  }
};