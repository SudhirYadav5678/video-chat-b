import { Server } from "socket.io";

const io = new Server(3000,{
    cors:true,
});

const emailToSocket = new Map();
const socketToEmail = new Map();


io.on("connection", (socket) => {
    console.log("New client connected",socket.id);
    socket.on('room-join', data=>{
        const {email, room} = data
        emailToSocket.set(email, socket.id)
        socketToEmail.set(socket.id, email)
        io.to(room).emit('user:joined',{email, id:socket.id})
        socket.join(room)
        io.to(socket.id).emit('room-join',data)
    })

    socket.on("user:call",({to, offer})=>{
       io.to(to).emit("incomming:call",{from:socket.id, offer})
    })

    socket.on("user:answer",({to, ans})=>{
        io.to(from).emit("user:answer",{from:socket.id, ans})
    })
  });