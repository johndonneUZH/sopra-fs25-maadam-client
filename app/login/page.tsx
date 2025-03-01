"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { Button, Form, Input, Spin } from "antd";
import HomeIcon from "@/components/HomeIcon"; 
// Optionally, you can import a CSS module or file for additional styling:
import styles from "@/styles/page.module.css";
import { useEffect, useState } from "react";

interface FormFieldProps {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);

  const { 
    // value: token, 
    set: setToken } = useLocalStorage<string>("token", "");
  const { value: id, set: setUserId } = useLocalStorage<number>("id", 0);

  useEffect(() => {
    if (id) {
      router.push(`/users/${id}`);
    }
  }, [id, router]);

  const handleLogin = async (values: FormFieldProps) => {
    try {
      setLoading(true);
      const response = await apiService.post<User>("/login/auth", values);
  
      if (response.token) {
        setToken(response.token);
      }
  
      if (response.id) {
        setUserId(parseInt(response.id, 10));
      }
  
      setLoading(false);
      router.push("/users");
    } catch (error: any) {
      setLoading(false);
      if (error.status === 404) {
        alert("User not found. Please check your username.");
      } else if (error.status === 401) {
        alert("Incorrect password. Please try again.");
      } else {
        alert(`Something went wrong during the login:\n${error.message}`);
      }
    }
  };

  // Show loading state until the check is done
  if (loading) {
    return (
      <div className="login-container">
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className={styles.homeIcon}>
        <HomeIcon />
      </div>
      <div className="login-container">
        <Form
          form={form}
          name="login"
          size="large"
          variant="outlined"
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Login
            </Button>
          </Form.Item>
          <footer>
            <a onClick={() => router.push("/register")}>Not signed up?</a>
          </footer>
        </Form>
      </div>
    </div>
  );
};

export default Login;
