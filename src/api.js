import io from "socket.io-client";

export const api = {
    socket: null,
    createConnection() {
        this.socket = io("http://localhost:3009", {
            transports: ["websocket"],
        });
        // this.socket = io("https://back-fora-soft-test.herokuapp.com", {
        //     transports: ["websocket"],
        // });
    },
    destroyConnection(user) {
        this.socket?.disconnect(user);
        this.socket = null;
    },
    leftRoom() {
        this.socket?.emit("client-user-Left");
    },
    sendClientData(user, userIdHandler) {
        this.socket?.emit("client-user-joined", user, (userId) => {
            userIdHandler(userId);
        });
    },
    subscribe(
        initMessagesHandler,
        newMessagesSentHandler,
        userTypingHandler,
        userStopedTypingHandler,
        userLeftRoomHandler,
        updateUsersHandler
    ) {
        this.socket?.on("init-messages-published", initMessagesHandler);
        this.socket?.on("new-message-sent", newMessagesSentHandler);
        this.socket?.on("user-is-typing", userTypingHandler);
        this.socket?.on("user-stoped-typing", userStopedTypingHandler);
        this.socket?.on("user-left-room", userLeftRoomHandler);
        this.socket?.on("update-users", updateUsersHandler);
    },
    sendMessage(message) {
        this.socket?.emit("client-message-sent", message, (error) => {
            if (error) alert(error);
        });
    },
    typeMessage() {
        this.socket?.emit("client-typed");
    },
    stopTypeMessage() {
        this.socket?.emit("client-stop-typed");
    },
};
