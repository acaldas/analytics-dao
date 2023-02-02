"use client";

import { Button } from "@analytics/ui";
import { useAuth } from "providers/auth";
import Login from "./login";

const Profile: React.FC = () => {
  const { loggedIn, address, logout } = useAuth();

  return (
    <div className="flex">
      <div>
        {loggedIn ? (
          <div className="flex items-center">
            <span className="mr-4">
              Connected to{" "}
              <span className="text-primary underline">
                {address?.slice(0, 5)}...{address?.slice(-4)}
              </span>
            </span>
            <Button onClick={() => logout()} color="dark">
              Disconnect
            </Button>
          </div>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
};

export default Profile;
