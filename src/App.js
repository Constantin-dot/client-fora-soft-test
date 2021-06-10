import React from "react";
import { Route, Switch } from "react-router-dom";
import styles from "./App.module.scss";
import { ChatRoom } from "./features/chatRoom/ChatRoom";
import { InitialForm } from "./features/initialForm/InitialForm";

const App = React.memo(() => {
    return (
        <div className={styles.App}>
            <Switch>
                <Route path={"/"} exact render={() => <InitialForm />} />
                <Route path={"/chat-room"} render={() => <ChatRoom />} />
                <Route path={"*"} render={() => <div>404 NOT FOUND</div>} />
            </Switch>
        </div>
    );
});

export default App;
