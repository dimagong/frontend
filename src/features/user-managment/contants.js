import React from 'react'
import { User, Info } from "react-feather"
import UserList from "./userList/UserList"
import UserCreate from "./userCreate/UserCreate"
import UserInvitations from "./userInvitations/UserInvitations"

export const navItemFactory = [
  { title: "Users", icon: () => <User size={16} />, component: () => <UserList /> },
  { title: "Create user", icon: () => <User size={16} />, component: () => <UserCreate/>  },
  { title: "Invitations", icon: () => <Info size={16} />, component: ({activeTab}) => <UserInvitations activeTab={activeTab}/>  },
];
