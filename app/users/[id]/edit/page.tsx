"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getApiDomain } from "@/utils/domain";
import HomeIcon from "@/components/HomeIcon";
import BackIcon from "@/components/BackIcon";
import styles from "@/styles/page.module.css";
import { Button, Card, DatePicker, Form, Input, Spin } from "antd";
import dayjs from "dayjs";

interface FormFieldProps {
  username: string;
  birthday?: string;
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

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm(); // Ant Design Form instance

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (id) {
      fetch(`${getApiDomain()}users/${id}`, {
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error("User not found");
          return response.json();
        })
        .then((data) => {
          setUser(data);
          form.setFieldsValue({
            username: data.username,
            birthday: data.birthday ? dayjs(data.birthday).format("YYYY-MM-DD") : "",
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
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

  if (!user) return <div className="text-center mt-5">User not found.</div>;

  const handleEdit = async (values: FormFieldProps) => {
    const updatedData = {
      ...values,
      birthday: values.birthday ? dayjs(values.birthday).format("YYYY-MM-DD") : "",
    };

    console.log("Updated values:", updatedData);

    try {
      const response = await fetch(`${getApiDomain()}users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      alert("Profile updated successfully!");
      router.push(`/users/${id}`);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="login-container">
      <div className={styles.homeIcon}>
        <HomeIcon />
      </div>
      <Card className={styles.card}>
        <BackIcon link={`/users/${id}`} />
        <div className={styles.profilePicWrapper}>
          <strong>
            <h3>Edit Profile</h3>
          </strong>
        </div>
        <Form form={form} layout="vertical" onFinish={handleEdit}>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter your username!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Birthday" name="birthday">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="w-100">
            Save Changes
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default EditProfile;
