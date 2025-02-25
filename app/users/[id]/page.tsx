/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, Button, Spin } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import HomeIcon from "@/components/HomeIcon"; 
import BackIcon from "@/components/BackIcon"; 
import { useApi } from "@/hooks/useApi";
import styles from "@/styles/page.module.css";

interface User {
  id: number;
  username: string;
  status: string;
  date: string;
  token: string;
  birthday?: string;
}

interface Params {
  id: string;
}

const UserProfile = () => {
  const params = useParams() as unknown as Params;
  const router = useRouter();
  const apiService = useApi();
  const id = params.id;

  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

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
        .then((data) => setUser(data))
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, router, apiService]);

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

  if (user === undefined) return <div>Loading...</div>;
  if (user === null) return <div>User not found.</div>;

  const localToken = localStorage.getItem("token")?.trim().replace(/^"|"$/g, "");
  const userToken = user?.token?.trim().toString();
  const isEdit = localToken === userToken;

  return (
    <div>
      <div className={styles.homeIcon}>
        <HomeIcon />
      </div>
      <div className="login-container">
        <Card className={styles.card}>
          <BackIcon link="/users" />
          <div className={styles.profilePicWrapper}>
            <div className={styles.profilePic}>
              <Image
                src={`https://picsum.photos/800/500?grayscale&random=${id}`}
                className={styles.profilePicImage}
                alt="Profile picture"
                width={150}
                height={150}
              />
            </div>
          </div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Status:</strong> {user.status}</p>
          <p><strong>Joined:</strong> {user.date}</p>
          {user.birthday && <p><strong>Birthday:</strong> {user.birthday}</p>}

          {isEdit && (
            <div className={styles.buttonContainer}>
              <Button type="primary" htmlType="submit" className={styles.editButton} onClick={() => router.push(`/users/${id}/edit`)}>
                Edit
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
