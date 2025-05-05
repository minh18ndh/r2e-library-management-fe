import React from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../store/services/authApi';

const { Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const onFinish = async (values) => {
    try {
      await register(values).unwrap();
      message.success('Registration successful. Please log in.');
      navigate('/login');
    } catch (err) {
      const detail = err?.data?.errors?.[0]?.detail;
      message.error(detail || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e1e2f] px-4">
      <h1 className="text-white text-5xl font-bold mb-20">MAISON DES LIVRES</h1>

      <div className="w-full max-w-[450px] bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

        <Form name="register" onFinish={onFinish} layout="vertical" autoComplete="off">
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text>Already have an account? </Text>
          <Button
            type="link"
            className="p-0 !text-[#1e1e2f] hover:!text-[#61616d] font-semibold"
            onClick={() => navigate('/login')}
          >
            Log in here
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;