import express from "express";
import bodyParser from "body-parser";
import api from "./routes";
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

let port = 8089;

app.use(bodyParser.json());

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// app.set("view engine", "ejs");
// app.set("views", "/src/views");

app.use("/api", api);

app.get("/test", (req, res) => {
  res.render("test.ejs", { title: "ejs" });
});

app.get("/", (req, res) => {
  res.render("client.ejs");
});

let count = 1;
io.on("connection", socket => {
  //사용자가 웹사이트에 접속하게 되면 'connection'
  //이벤트가 생성되고 또 그 사용자에 대한 socket 오브젝트가 생성됩니다.
  // 나머지 이벤트들은 이 connection 이벤트 안에서 정의해야 합니다.

  console.log("user connected: ", socket.id);
  let name = "user" + count++;
  console.log(name);
  io.to(socket.id).emit("change name", name);
  //사용자 이름을 조립해 준 다음, io.to(socket.id).emit('change name', name)을 해줍니다.

  //     socket이 생성되면 11번째줄의 function(socket)에 의해 socket이라는 object가 생성되는데, 이 object는 접속한 사용자에 대한 object입니다.각각의 socket object는 고유의 id를 가지며, socket.id에 저장되어 있습니다.
  //         emit는 '(빛 따위를) 발하다'라는 뜻으로 이벤트를 서버에서 클라이언트로 전달하는 함수입니다.
  // 'change name'은 이벤트 이름인데, 위에서 말했다시피 정해진 이벤트 이름이 아니고 제가 직접 만든 이벤트 이름입니다.
  //     생성자 본인의 socket.id를 넣었으니 to에 의해 본인에게만 change name이라는 이벤트를 쏘는 문장입니다.
  //     사용자가 접속하면 접속한 순서대로 user1, user2, user3등의 이름을 가지게 하기위한 코드입니다.

  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
    //disconnect시에 일어나는 이벤트인데, 따로 이벤트는 없고 console.log나 해줍시다.
  });

  socket.on("send message", (name, text) => {
    var msg = name + ":" + text;
    io.emit("receive message", msg);
    //'send message'라는 이벤트를 받았을때(on), 함께 전달받은 name과 text를 조립한후 io.emit을 해서 모든 접속자에게 'receive message'를 msg와 함께 쏩니다.
  });
});

http.listen(port, () => {
  console.log("Express is listening on port ", port);
});
