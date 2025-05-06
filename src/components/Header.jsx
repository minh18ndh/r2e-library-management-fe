import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { getUserRole } from '../utils/auth';

const Header = () => {
  const location = useLocation();
  const role = getUserRole();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // force reload
  };

  const menuItems = [];

  if (role === 'Admin') {
    menuItems.push(
      { label: <Link to="/manage-books">Books</Link>, key: 'books' },
      { label: <Link to="/manage-categories">Categories</Link>, key: 'categories' },
      { label: <Link to="/manage-borrow-requests">Borrow Requests</Link>, key: 'manage-borrow-requests' }
    );
  } else if (role === 'User') {
    menuItems.push(
      { label: <Link to="/books">Books</Link>, key: 'books' },
      { label: <Link to="/my-borrow-requests">Borrow Requests</Link>, key: 'my-borrow-requests' }
    );
  }

  const selectedKey = menuItems.find(item => location.pathname.includes(item.key))?.key;

  const dropdownItems = [
    {
      key: 'role',
      label: <span className="font-semibold">{role}</span>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

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
        <Dropdown
          menu={{ items: dropdownItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            shape="circle"
            icon={<UserOutlined />}
            className="flex items-center justify-center"
          />
        </Dropdown>
      </div>
    </Layout.Header>
  );
};

export default Header;