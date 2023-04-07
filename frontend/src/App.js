import { useEffect, useState } from "react";
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000/');

let data = [];

function App() {

  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');

  const [message, setMessage] = useState('');

  const [logged, setLogin] = useState(false);

  const [chats, setChats] = useState([]);

  let cla = '';

  const HandleLogin = () => {
    console.log(userName, roomName);
    setLogin(true);

    //for saving logging session
    let loginObject = 
    {
      userName: userName,
      roomName: roomName
    }

    socket.emit('join', roomName);
  }

  const SendMessage = () => {
    console.log('Msg Sent:' + message);
    // setMessage('')
    socket.emit('chat', message, roomName, userName);
  }

  // useEffect(() => {
  // //  console.log("Chat updated::::::::;")
  // }, [chats])

  socket.off('roomChat').on('roomChat', (msgObject) => {
    console.log('Room Chat Received:' + msgObject);
    msgObject = JSON.parse(msgObject)

    //  data = [];
    data = [...chats];

    let count = 0;
    if (data.length > 0) {
      count = data.length - 1;
      count += 1;
    }

    data[count] = msgObject;
    console.log("Check dataaaaaa",data)


    setChats(data);
    

    console.log('Chats In Array ----' + chats + 'and Length Is ' + chats.length);
  });



  return (
    <div className="App">
            <h1 className="title"> Welcome Chater ! To Your Favourite Chatting App</h1>

      {
        logged ?
        <div>
          <div className="welcome_UserName"> 
              <div className="inline_block">
                Welcome <span>{userName.charAt(0).toUpperCase() +userName.slice(1)}</span>
              </div> 
              
              <div className="inline_block float_right">
                  Active Room: <span className="span1">{roomName}</span> 
              </div>
          </div>
          <div className="chatBoxHolder">
           
            <div className="chatBox">
              <div className="chatBar">
                <ul>
                  
                  {
                    chats.map((c, index) =>
                      <li key={index}>

                        
                        <span className={`${c.userName === userName ? 'span1' : 'span2'}`}>
                           {c.userName + ':'}</span> {c.msg}
                      </li>
                    )
                  }
                </ul>
              </div>

            </div>

            <div id="msgBoxAndButtonHolder">
              <input id="input_msg" type="text" placeholder="Enter Message" value={message} onChange={(e) => setMessage(e.target.value)} />
              <button id="sendMsgBtn" onClick={SendMessage}> Send</button>
            </div>
          </div>
      </div>

          :
          <div className="loginMenuHolder">
            <div className="loginMenu">
              <input id="login_userName" type="text" placeholder="Enter UserName" value={userName} onChange={(e) => setUserName(e.target.value)} />
              <input id="login_roomName" type="text" placeholder="Enter RoomName" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
              <button id="login_btn" onClick={HandleLogin}>Login</button>
            </div>
          </div>
      }

    </div>
  );
}

export default App;
