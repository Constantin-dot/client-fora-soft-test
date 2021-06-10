import io from "socket.io-client";

export const api = {
    socket: null,
    createConnection() {
        // this.socket = io("http://localhost:3009", {
        //     transports: ["websocket"],
        // });
        this.socket = io("https://back-fora-soft-test.herokuapp.com", {
            transports: ["websocket"],
        });
    },
    destroyConnection() {
        this.socket?.disconnect();
        this.socket = null;
    },
    sendClientData(user, userIdHandler) {
        this.socket?.emit("client-user-joined", user, (userId) => {
            userIdHandler(userId);
        });
    },
    subscribe(initMessagesHandler, newMessagesSentHandler, userTypingHandler) {
        this.socket?.on("init-messages-published", initMessagesHandler);
        this.socket?.on("new-message-sent", newMessagesSentHandler);
        this.socket?.on("user-is-typing", userTypingHandler);
    },
    sendMessage(message) {
        this.socket?.emit("client-message-sent", message, (error) => {
            if (error) alert(error);
        });
    },
    typeMessage() {
        this.socket?.emit("client-typed");
    },
    clientDeleteAllMessages() {
        this.socket?.emit("client-deleted-all-messages");
    },
};
