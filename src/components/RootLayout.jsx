import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

const RootLayout = () => {
  return (
    <Layout>
      <Header />
      <Outlet />
      <Footer />
    </Layout>
  )
}

export default RootLayout;