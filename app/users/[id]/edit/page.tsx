"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Spin } from "antd";
import { getApiDomain } from "@/utils/domain";
import HomeIcon from "@/components/HomeIcon";
import styles from "@/styles/page.module.css";

interface FormFieldProps {
  username: string;
  birthday: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  status: string;
  date: string;
  token: string;
  birthday?: string;
}

const EditProfile = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${getApiDomain()}users/${id}`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("User not found");
        return response.json();
      })
      .then((data) => {
        if (data.token.trim() !== token.trim()) {
          router.push(`/users/${id}`);
        } else {
          setUser(data);
          form.setFieldsValue({
            username: data.username,
            birthday: data.birthday || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [id, router, form]);

  if (loading) {
    return (
      <div className="login-container">
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!user) return <div>User not found.</div>;

  const handleEdit = async (values: FormFieldProps) => {
    console.log("Updated values:", values);
    // Here you would send the updated values to the API
  };

  return (
    <div>
      <div className={styles.homeIcon}>
        <HomeIcon />
      </div>
      <div className="login-container">
        <Form form={form} onFinish={handleEdit} className={styles.formContainer}>
          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="Birthday" name="birthday">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
