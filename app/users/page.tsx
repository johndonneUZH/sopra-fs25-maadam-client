"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { User } from "@/types/user";
import { Button, Card, Table, Spin } from "antd";
import HomeIcon from "@/components/HomeIcon";
import styles from "@/styles/page.module.css";

const columns = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  }
];

const Dashboard: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect immediately if no token is found
      router.push("/login");
      return; // Exit early to avoid unnecessary state change
    }

    // Fetch users only if token exists
    const fetchUsers = async () => {
      try {
        const users: User[] = await apiService.get<User[]>("/users", {
          headers: {
            Authorization: token.trim().replace(/^"|"$/g, ""),
          },
        });
        setUsers(users);
        console.log("Fetched users:", users);
      } catch (error) {
        if (error instanceof Error) {
          alert(`Something went wrong while fetching users:\n${error.message}`);
        } else {
          console.error("An unknown error occurred while fetching users.");
        }
      } finally {
        setLoading(false); // Set loading to false once data has been fetched
      }
    };

    fetchUsers();
  }, [apiService, router]); 

  const handleLogout = async (): Promise<void> => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
  
    if (!id || !token) {
      alert("User ID or token not found. Please log in again.");
      router.push("/login");
      return;
    }
  
    try {
      // Send the logout request
      await apiService.put("/users/logout", {
        id: id,
        token: token.trim().replace(/^"|"$/g, ""), 
      });
  
      // Clear local storage and redirect to login page
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      router.push("/login");
      
    } catch (error) {
      console.error("Error setting status to offline:", error);
      alert("An error occurred while logging out. Please try again.");
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
        <div className="card-container">
          <Card
            title="Get all users from secure endpoint:"
            loading={loading}
            className="dashboard-container"
          >
            {users && (
              <>
                <Table<User>
                  columns={columns}
                  dataSource={users}
                  rowKey="id"
                  onRow={(row) => ({
                    onClick: () => router.push(`/users/${row.id}`),
                    style: { cursor: "pointer" },
                  })}
                />
                <Button onClick={handleLogout} type="primary" className={styles.logoutButton}>
                  Logout
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
