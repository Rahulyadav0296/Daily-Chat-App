import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer.jsx";
import Contacts from "../components/Contacts.jsx";
import Welcome from "../components/Welcome.jsx";
import { allUsersRoute, host } from "../utils/APIRoutes";

function Chat() {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const socket = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // set the user details insides current users
    const chatDetails = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        let userDetails = await JSON.parse(
          localStorage.getItem("chat-app-user")
        );
        setCurrentUser(userDetails);
        setIsLoaded(true);
      }
    };
    chatDetails();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    // set the current user details
    const currentUserDetails = async () => {
      if (currentUser) {
        try {
          if (currentUser.isAvatarImageSet) {
            const response = await axios.get(
              `${allUsersRoute}/${currentUser._id}`
            );
            console.log("The data is: ", response.data);
            setContacts(response.data);
          } else {
            navigate("/setAvatar");
          }
        } catch (error) {
          console.error("Error Fetching user details: ", error);
        }
      }
    };
    currentUserDetails();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            chatChange={handleChatChange}
          />

          {isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          )}
        </div>
      </Container>
    </>
  );
}

export default Chat;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
