"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input } from "antd";
import HomeIcon from "@/components/HomeIcon"; 
import styles from "@/styles/page.module.css";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect } from "react";

interface FormFieldProps {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface UserGetDTO {
  id: number;
  username: string;
  token: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();

  const { 
    // value: token, 
    set: setToken } = useLocalStorage<string>("token", "");
  const { value: id, set: setUserId } = useLocalStorage<number>("id", 0);

  useEffect(() => {
    if (id) {
      router.push(`/users/${id}`);
    }
  }, [id, router]);

  const handleRegister = async (values: FormFieldProps) => {
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      // Send only username and password in the body
      const response = await apiService.post<UserGetDTO>("/users", {
        username: values.username,
        password: values.password,
      });
  
      if (!response.token) {
        throw new Error("Registration failed: Missing token in response.");
      }
  
      setToken(response.token);
      setUserId(response.id);
  
      router.push(`/users/${response.id}`);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        alert("Registration failed: Username already exists.");
      } else if (error instanceof Error) {
        alert(`Something went wrong during the registration:\n${error.message}`);
      } else {
        console.error("An unknown error occurred during registration.");
      }
    }
  };
  

  return (
    <div>
      <div className={styles.homeIcon}>
        <HomeIcon />
      </div>
      <div className="login-container">
        <Form
          form={form}
          name="register"
          size="large"
          variant="outlined"
          onFinish={handleRegister}
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
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Re-enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Register
            </Button>
          </Form.Item>
          <footer>
            <a onClick={() => router.push("/login")}>Already registered?</a>
          </footer>
        </Form>
      </div>
    </div>
  );
};

export default Register;