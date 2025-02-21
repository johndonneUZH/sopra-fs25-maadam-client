"use client";

import { useParams } from "next/navigation";
import { Card, Button, Form } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getApiDomain } from "@/utils/domain";
import styles from "@/styles/page.module.css";

interface User {
  id: number;
  name: string;
  username: string;
  status: string;
  date: string;
  birthday?: string;
}

const UserProfile = () => {
  const params = useParams();
  const id = params?.id as string;

  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (id) {
      fetch(`${getApiDomain()}users/${id}`, {
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error("User not found");
          return response.json();
        })
        .then((data) => setUser(data))
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUser(null);
        });
    }
  }, [id]);

  if (user === undefined) return <div>Loading...</div>;
  if (user === null) return <div>User not found.</div>;

  return (
    <div className="login-container">

      <Card className={styles.card}>
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
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Status:</strong> {user.status}</p>
        <p><strong>Joined:</strong> {user.date}</p>
        {user.birthday && <p><strong>Birthday:</strong> {user.birthday}</p>}
        <Button type="primary" htmlType="submit" className={styles.logoutButton}>
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default UserProfile;
