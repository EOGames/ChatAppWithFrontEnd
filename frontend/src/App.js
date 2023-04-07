import {useState } from "react";
import {io} from 'socket.io-client';

const socket = io('http://localhost:5000/');

let data = [];
function App() {
  
  const [userName,setUserName] = useState('');
  const [roomName,setRoomName] = useState('');
  
  const [message,setMessage] = useState('');

  const [logged,setLogin] = useState(false);

  const [chats,setChats] = useState([]);
  
  
  const HandleLogin = ()=>
  {
      console.log(userName, roomName);
      setLogin(true);

      socket.emit('join',roomName);
  }

  const SendMessage = ()=>
  {
    console.log('Msg Sent:'+message);
    socket.emit('chat',message,roomName);
  }

 
  socket.on('roomChat',(msg)=>
  {
    console.log('Room Chat Received:' + msg);
    let count = 0;
    if (data.length >0)
    {
      count = data.length -1;
      count +=1;      
    }

    data[count] = msg;

    setChats(data);

    console.log('Chats In Array ----'+chats + 'and Length Is '+chats.length);
  });

  
  
  return (
    <div className="App">
      
      {
        logged ? 
          <div className="chatBoxHolder">
            <div className="chatBox">
              <div className="chatBar">
                  <ul>
                    {
                      chats.map((c,index)=>                      
                      <li key={index}>{c}</li>
                      ) 
                    }
                  </ul>
              </div>

            </div>

            <div id="msgBoxAndButtonHolder">
                    <input id="input_msg" type="text" placeholder="Enter Message" value={message} onChange={(e) => setMessage(e.target.value)}/>
                    <button id="sendMsgBtn" onClick={SendMessage}> Send</button>
                </div>
          </div>
        :       
        <div>
          <input type="text" placeholder="Enter UserName" value={userName} onChange={(e)=> setUserName(e.target.value)} />
          <input type="text" placeholder="Enter RoomName" value={roomName} onChange={(e)=> setRoomName(e.target.value)} />
          <button onClick={HandleLogin}>Login</button>
        </div>
      }

         </div>
  );
}

export default App;
