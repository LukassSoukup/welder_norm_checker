import * as React from 'react';

const App = () => (
    <div>
        Title: <input id="title"/>
        <button onClick={clickEvent} id="btn" type="button">Set</button>
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
    const chrome =  window.versions.chrome();
    const node =  window.versions.node();
    const electron =  window.versions.electron();
    window.versions.notificationApi.sendNotification("ayo!");
    console.log("renderrer is saying: " + response, chrome, node, electron);
}
export default App;