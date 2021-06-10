import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setClientData } from "../../chat-reducer";
import styles from "./InitialForm.module.scss";

export const InitialForm = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [room, setRoom] = useState("");

    const onClickHandler = () => {
        dispatch(setClientData("", name, room));
        history.push("chat-room");
    };

    return (
        <div className={styles.formBlock}>
            Please, enter your nickname:
            <input
                className={styles.input}
                onChange={(e) => setName(e.currentTarget.value)}
            />
            Please, enter room name:
            <input
                className={styles.input}
                onChange={(e) => setRoom(e.currentTarget.value)}
            />
            <button className={styles.button1} onClick={onClickHandler}>
                Enter
            </button>
        </div>
    );
};
