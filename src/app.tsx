import * as React from 'react';
import {OrderCreateForm} from "./GUI/OrderCreateForm";

const App = () => (
    <div>
        <OrderCreateForm/>
    </div>
)
const clickEvent = async () => {
    const titleInput = document.getElementById('title') as HTMLInputElement
    const title = titleInput.value
    window.electronAPI.setTitle(title)
    await func();
};

const func = async () => {
    const response = await window.versions.ping();
    const chrome = window.versions.chrome();
    const node = window.versions.node();
    const electron = window.versions.electron();
    window.versions.notificationApi.sendNotification("ayo!");
    console.log("renderrer is saying: " + response, chrome, node, electron);
}
export default App;