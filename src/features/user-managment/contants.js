import React from 'react'
import { User, Info } from "react-feather"
import UserList from "./userList/UserList"

export const navItemFactory = [
  { title: "Users", icon: () => <User size={16} />, component: () => <UserList /> },
  { title: "Create user", icon: () => <User size={16} />, component: () => <></>  },
  { title: "Invitations", icon: () => <Info size={16} />, component: () => <></>  },
];
