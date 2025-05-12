import { Link, useNavigate } from 'react-router-dom';
import { removeToken, isAuthenticated } from '../utils/auth';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAuthenticated() ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Cadastro</Link>
        </>
      )}
    </nav>
  );
}
