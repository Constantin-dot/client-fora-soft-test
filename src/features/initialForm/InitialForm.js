import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setClientData } from "../../chat-reducer";
import styles from "./InitialForm.module.scss";

export const InitialForm = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            name: "",
            room: "",
        },
        validate: (values) => {
            const errors = {};
            if (!values.name) {
                errors.name = "Field is required";
            }
            if (!values.room) {
                errors.room = "Field is required";
            }
            return errors;
        },
        onSubmit: (values) => {
            dispatch(setClientData("", values.name, values.room));
            history.push("/client-fora-soft-test/chat-room");
        },
    });

    return (
        // Добавить формик с валидацией
        <form className={styles.formBlock} onSubmit={formik.handleSubmit}>
            <h3>Websocket chat</h3>

            <p>Please, enter your nickname:</p>
            <input
                className={styles.input}
                type={"text"}
                placeholder={"your nickname"}
                {...formik.getFieldProps("name")}
            />
            {!!formik.errors.name && formik.touched.name ? (
                <div className={styles.errorText}>{formik.errors.name}</div>
            ) : null}

            <p>Please, enter room name:</p>
            <input
                className={styles.input}
                type={"text"}
                placeholder={"room name"}
                {...formik.getFieldProps("room")}
            />
            {!!formik.errors.room && formik.touched.room ? (
                <div className={styles.errorText}>{formik.errors.room}</div>
            ) : null}

            <button className={styles.button1} type="submit">
                Enter
            </button>
        </form>
    );
};
