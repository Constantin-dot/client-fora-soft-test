import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
    createConnection,
    destroyConnection,
    sendMessage,
    stopTypeMessage,
    typeMessage,
    userLeftRoom,
} from "../../chat-reducer";
import styles from "./ChatRoom.module.scss";

export const ChatRoom = () => {
    const { user, messages, typingUsers, onlineUsers } = useSelector(
        (state) => state.chat
    );

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(createConnection());
        return () => {
            dispatch(destroyConnection(user));
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
    const leftRoomHandler = () => {
        dispatch(userLeftRoom());
        history.push("/client-fora-soft-test");
    };

    return (
        <div className={styles.chatWrapper}>
            <div className={styles.headerBlock}>
                <h2>Chat page {user.room}</h2>
                <button className={styles.exitButton} onClick={leftRoomHandler}>
                    Exit from room
                </button>
            </div>
            <div className={styles.chatBlock}>
                <div className={styles.onlineUsersBlock}>
                    {onlineUsers ? (
                        onlineUsers.map((user) => {
                            return <div key={user.id}>{user.name}</div>;
                        })
                    ) : (
                        <div></div>
                    )}
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
            </div>
            <div className={styles.enterMessageBlock}>
                <textarea
                    className={styles.textarea}
                    value={message}
                    onKeyDown={() => {
                        dispatch(typeMessage());
                    }}
                    onKeyUp={() => {
                        dispatch(stopTypeMessage());
                    }}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                />
                <button
                    className={styles.enterButton}
                    onClick={() => {
                        dispatch(sendMessage(message));
                        setMessage("");
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};
