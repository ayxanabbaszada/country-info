const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Sadə oyunçu və otaq idarəsi üçün struktur
let rooms = {}; // roomId -> { players: [socketId], scores: {socketId: score} }

io.on('connection', (socket) => {
  console.log('Yeni oyunçu qoşuldu:', socket.id);

  // Otağa qoşulma
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = { players: [], scores: {} };
    }

    if (rooms[roomId].players.length < 2) {
      rooms[roomId].players.push(socket.id);
      rooms[roomId].scores[socket.id] = 0;

      // Otaqdakı oyunçuları xəbərdar et
      io.to(roomId).emit('roomUpdate', rooms[roomId].players);

      if (rooms[roomId].players.length === 2) {
        // Oyun başlasın deyirik
        io.to(roomId).emit('startGame');
      }
    } else {
      // Otaq doludur
      socket.emit('roomFull');
    }
  });
if (mode === 'competitive') {
    // yalnız rəqabətçi mod üçün score DB-ə yazılır
    saveScoreToDB(userId, score);
}

  // Cavab gəldi
  socket.on('answer', ({ roomId, isCorrect }) => {
    if (!rooms[roomId]) return;
    if (!rooms[roomId].scores[socket.id]) return;

    if (isCorrect) {
      rooms[roomId].scores[socket.id] += 10;
    } else {
      rooms[roomId].scores[socket.id] = Math.max(0, rooms[roomId].scores[socket.id] - 5);
    }

    // Skorları otaqdakı oyunçulara göndəririk
    io.to(roomId).emit('scoreUpdate', rooms[roomId].scores);
  });

  // Bağlanma zamanı otaqdan oyunçu çıxarılır
  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      const idx = rooms[roomId].players.indexOf(socket.id);
      if (idx !== -1) {
        rooms[roomId].players.splice(idx, 1);
        delete rooms[roomId].scores[socket.id];
        io.to(roomId).emit('roomUpdate', rooms[roomId].players);
        // Otaq boşsa silirik
        if (rooms[roomId].players.length === 0) {
          delete rooms[roomId];
        }
        break;
      }
    }
    console.log('Oyunçu ayrıldı:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir`);
});
