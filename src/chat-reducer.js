import { api } from "./api";

const initialState = {
    user: {
        id: "",
        name: "",
        room: "",
    },
    messages: [],
    typingUsers: [],
    onlineUsers: [],
};

//reducer

export const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case "messages-received": {
            return { ...state, messages: action.messages };
        }
        case "new-message-received": {
            return {
                ...state,
                messages: [...state.messages, action.message],
                typingUsers: state.typingUsers.filter(
                    (u) => u.id !== action.message.user.id
                ),
            };
        }
        case "add-typing-user": {
            return {
                ...state,
                typingUsers: [
                    ...state.typingUsers.filter((u) => u.id !== action.user.id),
                    action.user,
                ],
            };
        }
        case "remove-typing-user": {
            return {
                ...state,
                typingUsers: state.typingUsers.filter(
                    (u) => u.id !== action.user.id
                ),
            };
        }
        case "delete-all-messages": {
            return { ...state, messages: [] };
        }
        case "set-user": {
            return {
                ...state,
                user: {
                    id: action.payload.id,
                    name: action.payload.name,
                    room: action.payload.room,
                },
            };
        }
        case "set-userId": {
            return { ...state, user: { ...state.user, id: action.userId } };
        }
        case "remove-user": {
            return {
                ...state,
                user: { id: "", name: "", room: "" },
                messages: [],
                typingUsers: [],
                onlineUsers: [],
            };
        }
        case "update-users-list": {
            return {
                ...state,
                onlineUsers: action.users,
            };
        }
        default:
            return state;
    }
};

//actions

const messagesReceived = (messages) => ({
    type: "messages-received",
    messages,
});
const newMessageReceived = (message) => ({
    type: "new-message-received",
    message,
});
const setUser = (id, name, room) => ({
    type: "set-user",
    payload: { id, name, room },
});
const setUserId = (userId) => ({ type: "set-userId", userId });
const removeUser = () => ({ type: "remove-user" });
const addTypingUser = (user) => ({ type: "add-typing-user", user });
const removeTypingUser = (user) => ({ type: "remove-typing-user", user });
const deleteAllMessages = () => ({ type: "delete-all-messages" });
const updateUsersList = (users) => ({ type: "update-users-list", users });

//thunks

export const createConnection = () => (dispatch, getState) => {
    api.createConnection();
    api.subscribe(
        (messages) => {
            dispatch(messagesReceived(messages));
        },
        (message) => {
            dispatch(newMessageReceived(message));
        },
        (user) => {
            dispatch(addTypingUser(user));
        },
        (user) => {
            dispatch(removeTypingUser(user));
        },
        () => {
            dispatch(deleteAllMessages());
            dispatch(removeUser());
        },
        (users) => {
            dispatch(updateUsersList(users));
        }
    );
    let user = getState().chat.user;
    api.sendClientData(user, (userId) => {
        dispatch(setUserId(userId));
    });
};

export const setClientData = (id, name, room) => (dispatch) => {
    dispatch(setUser(id, name, room));
};

export const sendMessage = (message) => () => {
    api.sendMessage(message);
};

export const typeMessage = () => (dispatch) => {
    api.typeMessage();
};

export const stopTypeMessage = () => (dispatch) => {
    api.stopTypeMessage();
};

export const destroyConnection = (user) => (dispatch) => {
    api.destroyConnection(user);
    dispatch(removeUser());
    dispatch(deleteAllMessages());
};

export const userLeftRoom = () => (dispatch) => {
    api.leftRoom();
};
