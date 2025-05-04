import { Layout } from 'antd'

const Footer = () => {
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      Ant Design ©{new Date().getFullYear()} Created by Ant UED
    </Layout.Footer>
  );
}

export default Footer;