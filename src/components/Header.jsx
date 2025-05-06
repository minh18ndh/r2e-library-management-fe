import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { getUserRole } from '../utils/auth';

const Header = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // force refresh
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
    <Layout.Header className="!bg-[#1e1e2f] flex justify-between items-center px-6">
      <div className="flex items-center">
        <Link to="/home" className="!text-white font-bold mr-9">
          MAISON DES LIVRES
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey || '']}
          items={menuItems}
          className="!bg-[#1e1e2f]"
        />
      </div>
      <div className="flex items-center">
        <Button onClick={handleLogout} type="primary" danger>
          Logout
        </Button>
      </div>
    </Layout.Header>
  );
};

export default Header;