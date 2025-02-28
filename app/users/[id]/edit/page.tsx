"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import HomeIcon from "@/components/HomeIcon";
import BackIcon from "@/components/BackIcon";
import styles from "@/styles/page.module.css";
import { Button, Card, DatePicker, Form, Input, Spin } from "antd";
import dayjs from "dayjs";
import { getApiDomain } from "@/utils/domain";

interface FormFieldProps {
  username: string;
  birthday?: string;
}

interface User {
  id: number;
  username: string;
  status: string;
  date: string;
  token: string;
  birthday?: string;
}

const EditProfile = () => {
  const router = useRouter();
  const params = useParams();
  const apiService = useApi();
  const id = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (id) {
      apiService
        .get<User>(`/users/${id}`, {
          headers: { Authorization: token.trim().replace(/^"|"$/g, "") },
        })
        .then((data) => {
          if (token.trim().replace(/^"|"$/g, "") !== data.token) {
            router.push("/login");
            return;
          }
          setUser(data);
          form.setFieldsValue({
            username: data.username,
            birthday: data.birthday ? dayjs(data.birthday) : null,
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
  }, [id, router, form, apiService]);

  if (loading) {
    return (
      <div className="login-container">
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  

  if (!user) return <div className="text-center mt-5">{user}</div>;

  const handleEdit = async (values: FormFieldProps) => { 
    const updatedData = {
        ...values,
        birthday: values.birthday ? dayjs(values.birthday).format("YYYY-MM-DD") : null,
    };

    console.log("Updated values:", updatedData);
    setSubmitting(true);

    try {
        const response = await fetch(`${getApiDomain()}/users/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: user.token.trim().replace(/^"|"$/g, "")
            },
            body: JSON.stringify(updatedData),
        });

        if (response.status === 204) {
            // Successful update with no content
            alert("Profile updated successfully!");
            router.push(`/users/${id}`);
            return;
        } 

        // Handle other responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.message) {
                throw new Error(data.message);
            } else {
                throw new Error("Failed to update profile");
            }
        } else {
            throw new Error("Unexpected response from server");
        }
    } catch (error: any) {
        alert(error.message || "An unexpected error occurred while updating the profile.");
    } finally {
        setSubmitting(false);
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
          <Button type="primary" htmlType="submit" className="w-100" loading={submitting}>
            Save Changes
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default EditProfile;
