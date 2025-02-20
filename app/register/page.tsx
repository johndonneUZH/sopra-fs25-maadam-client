"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button, Form, Input, Alert } from "antd";
import styles from "@/styles/page.module.css";

interface FormFieldProps {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();

  const handleRegister = async (values: FormFieldProps) => {

    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Call the API service and let it handle JSON serialization and error handling
      const response = await apiService.post("/api/users/register", values);

      // Navigate to the login page after successful registration
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong during the registration:\n${error.message}`);
      } else {
        console.error("An unknown error occurred during registration.");
      }
    }
  };

  return (
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
  );
};

export default Register;