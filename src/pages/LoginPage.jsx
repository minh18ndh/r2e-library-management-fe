import React from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../store/services/authApi';

const { Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      const user = await login(values).unwrap();
      localStorage.setItem('user', JSON.stringify(user));
      message.success('Login successful');
      navigate('/home');
    } catch (err) {
      const detail =
        err?.data?.errors?.[0]?.detail ||
        Object.values(err?.data?.errors || {})[0]?.[0] ||
        err?.data?.title ||
        'Login failed';
      message.error(detail);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e2f] px-4">
      <h1 className="text-white text-5xl font-bold mb-20">MAISON DES LIVRES</h1>

      <div className="w-full max-w-[450px] bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <Form name="login" onFinish={onFinish} layout="vertical" autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please fill your email!' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please fill your password!' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              block
              loading={isLoading}
              size="large"
              type="primary"
              className="!bg-[#1e1e2f] !text-white !border-none hover:!bg-[#61616d]"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text>First time? </Text>
          <Button
            type="link"
            className="p-0 !text-[#1e1e2f] hover:!text-[#61616d] font-semibold"
            onClick={() => navigate('/register')}
          >
            Sign up here
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;