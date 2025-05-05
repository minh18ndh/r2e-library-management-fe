import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { getUserRole, isLoggedIn } from '../utils/auth';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const role = getUserRole();

  const menuItems = [];

  if (role === 'Admin') {
    menuItems.push(
      { label: <Link to="/manage-books">Books</Link>, key: 'books' },
      { label: <Link to="/manage-categories">Categories</Link>, key: 'categories' },
      { label: <Link to="/manage-borrow-requests">Borrow Requests</Link>, key: 'manage-borrow-requests' },
    );
  } else if (role === 'User') {
    menuItems.push(
      { label: <Link to="/books">Books</Link>, key: 'books' },
      { label: <Link to="/my-borrow-requests">Borrow Requests</Link>, key: 'my-borrow-requests' },
    );
  }

  const selectedKey = menuItems.find(item => location.pathname.includes(item.key))?.key;

  return (
    <Layout.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/home" style={{ color: '#fff', marginRight: '35px', fontWeight: 'bold' }}>
          MAISON DES LIVRES
        </Link>
        <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey || '']} items={menuItems} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button onClick={handleLogout} type="primary" danger>
          Logout
        </Button>
      </div>
    </Layout.Header>
  );
};

export default Header;