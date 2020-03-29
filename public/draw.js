/**
 * This class handles the drawing aspect of online-pictionary
 */

window.addEventListener("load", () => {

    const canvas = document.getElementById("myCanvas");
    const c = canvas.getContext("2d");
    
    c.canvas.width  = window.innerWidth;
    c.canvas.height = window.innerHeight;

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

        /**
         * "draw" is sending the x, y, socket.id, and color to the server which is then 
         * stored in the Game object for later retrieval if needed.
         */

        socket.emit("draw", {
            id: socket.id,
            x: pos.x,
            y: pos.y,
            color: color
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

    /**
     * "draw-current" draws what has already been drawn on the canvas.
     */

    socket.on("draw-current", (data) => {
        for(var i = 0; i < data.drawings.length; i++) {
            if(data.drawings[i].room === window.localStorage.getItem("r")) {
                draw_(data.drawings[i].x, data.drawings[i].y, data.drawings[i].color);
            }
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
