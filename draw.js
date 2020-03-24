window.addEventListener("load", () => {

    var socket = io.connect("http://localhost:4000");

    const canvas = document.getElementById("myCanvas");
    const c = canvas.getContext("2d");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

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
     
        // c.lineWidth = 5;
        // c.lineCap = "round";

        // c.lineTo(e.clientX, e.clientY);
        // c.stroke();
        // c.beginPath();
        // c.moveTo(e.clientX, e.clientY);

        var pos = mousePos(e);

        c.fillStyle = "red";
        c.fillRect(pos.x, pos.y, 10, 10);

        socket.emit("draw", {
            x: pos.x,
            y: pos.y,
            id: socket.id
        })
    }

    function draw_(x, y) {
        
        // c.lineWidth = 5;
        // c.lineCap = "round";

        // c.lineTo(x, y);
        // c.stroke();
        // c.beginPath();
        // c.moveTo(x, y);

        c.fillStyle = "blue";
        c.fillRect(x, y, 10, 10);

    }

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    socket.on("draw", (data) => {
        draw_(data.x, data.y);
    })
        
})
