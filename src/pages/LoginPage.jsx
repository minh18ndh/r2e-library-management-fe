import React from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../store/services/authApi';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      const user = await login(values).unwrap();
      console.log(user);
      localStorage.setItem('user', JSON.stringify(user));
      message.success('Login successful');
      navigate('/home');
    } catch (err) {
      if (err && typeof err === 'object' && 'data' in err) {
        message.error(err.data?.message || 'Login failed');
      } else {
        message.error('Login failed');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card title={<Title level={3}>Login</Title>} className="w-[350px]">
        <Form name="login" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;