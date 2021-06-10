import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
    clientDeleteAllMessages,
    createConnection,
    destroyConnection,
    sendMessage,
    typeMessage,
} from "../../chat-reducer";
import styles from "./ChatRoom.module.scss";

export const ChatRoom = () => {
    const { user, messages, typingUsers } = useSelector((state) => state.chat);
    const onlineUsers = [
        { id: 1, name: "Саша" },
        { id: 2, name: "Маша" },
        { id: 3, name: "Паша" },
    ];

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(createConnection());
        return () => {
            dispatch(destroyConnection());
        };
        // eslint-disable-next-line
    }, []);

    const [message, setMessage] = useState("");

    const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    useEffect(() => {
        if (isAutoScrollActive) {
            messagesAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        // eslint-disable-next-line
    }, [messages, typingUsers]);

    const messagesAnchorRef = useRef(null);
    const styleHandler = (name) => {
        if (name === "admin") {
            return styles.adminMessage;
        } else if (name === user.name) {
            return styles.mineMessage;
        } else {
            return styles.strangeMessage;
        }
    };

    return (
        <div className={styles.chatWrapper}>
            <h1>Chat page {user.room}</h1>
            <div className={styles.chatBlock}>
                <div className={styles.onlineUsersBlock}>
                    {onlineUsers.map((user) => {
                        return <div key={user.id}>{user.name}</div>;
                    })}
                </div>
                <div
                    className={styles.messages}
                    onScroll={(e) => {
                        let element = e.currentTarget;
                        let maxScrollPosition =
                            element.scrollHeight - element.clientHeight;

                        if (
                            element.scrollTop > lastScrollTop &&
                            Math.abs(maxScrollPosition - element.scrollTop) < 5
                        ) {
                            setIsAutoScrollActive(true);
                        } else {
                            setIsAutoScrollActive(false);
                        }
                        setLastScrollTop(e.currentTarget.scrollTop);
                    }}
                >
                    {messages.map((m) => {
                        return (
                            <div
                                key={m.id}
                                className={styleHandler(m.user.name)}
                            >
                                <b>{m.user.name}:</b> {m.message}
                            </div>
                        );
                    })}
                    {typingUsers.map((m) => {
                        return (
                            <div key={m.id}>
                                <b>{m.name}</b> is typing...
                            </div>
                        );
                    })}
                    <div ref={messagesAnchorRef} />
                </div>
                <div className={styles.enterMessageBlock}>
                    <textarea
                        className={styles.elem}
                        value={message}
                        onKeyPress={() => {
                            dispatch(typeMessage());
                        }}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                    />
                    <button
                        className={styles.button2}
                        onClick={() => {
                            dispatch(sendMessage(message));
                            setMessage("");
                        }}
                    >
                        Send
                    </button>
                    <button
                        className={styles.button2}
                        onClick={() => {
                            dispatch(clientDeleteAllMessages());
                        }}
                    >
                        Delete all messages
                    </button>
                    <button
                        className={styles.button2}
                        onClick={() => history.push("/client-fora-soft-test")}
                    >
                        Exit from room
                    </button>
                </div>
            </div>
        </div>
    );
};
