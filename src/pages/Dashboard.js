// Página protegida (área logada)

import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/items', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!res.ok) throw new Error('Erro ao buscar itens');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        toast.error('Erro ao carregar itens');
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      <h2>Área Logada</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.nome}</li>
        ))}
      </ul>
    </div>
  );
}
