const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const http = require('http').Server(app);

const botName ='(ADMIN)';
    

const io = require('socket.io')(http,
{
    cors: 
    {
        origin:'http://localhost:3000',
        methods:['GET','POST']
    }
});

io.on('connection',(socket)=>
{
    console.log(' Socket ID:'+socket.id + " Connected");

    socket.on('disconnect',(socket)=>
    {
        console.log("user Disconnected");
    });

    socket.on('join',(roomName,userName)=>
    {
        socket.join(roomName);
        console.log(socket.id + " Joined Room Name "+roomName);

        // sending notifaction to users in same room that some one joined
        let botObject =
        {
            userName: botName,
            msg: `${userName} Joined Chat Room`
        }
        if (userName!== '')
        {
            io.to(roomName).emit('roomChat', JSON.stringify(botObject));
        }
    });

    socket.on('left',(roomName,userName)=>
    {
        //sending notification to users in same room that some one left
        let botObject =
        {
            userName: botName,
            msg: `${userName} Left Chat Room`
        }
        io.to(roomName).emit('roomChat', JSON.stringify(botObject));
    });

    socket.on('chat',(msg,roomName,userName)=>
    {
        console.log("RoomName"+ roomName +' MSG Recived:'+msg );
        let chatobject = 
        {
            userName:userName,
            msg: msg
        }
        io.to(roomName).emit('roomChat',JSON.stringify(chatobject));
    });
});

http.listen(5000,()=>
{
    console.log('Server Is Up and Running on Port 5000');
});