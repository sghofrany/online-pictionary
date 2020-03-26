window.addEventListener("load", () => {

    // var socket = io.connect("http://localhost:4000");
    // var socket = io.connect();
    
    const canvas = document.getElementById("myCanvas");
    const c = canvas.getContext("2d");

    let painting = false;

    function startPosition(e) {
        painting = true;
        draw(e); //allows us to click and draw a dot
    }

    function finishedPosition() {
        painting = false;
        c.beginPath(); //prevents a line being drawn from where you left off
    } 

    function mousePos(e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    function draw(e) {
        if(!painting) return;

        var pos = mousePos(e);
       
        var color = getColorSelected();
       
        c.fillStyle = color;
        c.fillRect(pos.x, pos.y, 10, 10);

        socket.emit("draw", {
            x: pos.x,
            y: pos.y,
            color: color,
            id: socket.id
        })
    }

    function draw_(x, y, color) {
        c.fillStyle = color;
        c.fillRect(x, y, 10, 10);
    }

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    socket.on("draw", (data) => {
        draw_(data.x, data.y, data.color);
    })

    socket.on("login", (data) => {
        for(var i = 0; i < data.drawings.length; i++) {
            draw_(data.drawings[i].x, data.drawings[i].y, data.drawings[i].color);
        }
    })
        
})

function getColorSelected() {
    for(var i = 0; i < document.getElementsByName("color").length; i++) {
        if(document.getElementsByName("color")[i].checked === true) {
            return document.getElementsByName("color")[i].value;
        }
    }
}
