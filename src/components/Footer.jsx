import { Layout } from 'antd';

const Footer = () => {
  return (
    <Layout.Footer className="!bg-[#1e1e2f] !text-white text-center">
      Maison des Livres ©{new Date().getFullYear()} Created by NDHM
    </Layout.Footer>
  );
};

export default Footer;