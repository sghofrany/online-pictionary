window.addEventListener("load", () => {

    var input = document.getElementById('chat-input');
    var last = "";

    input.addEventListener('keypress', function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            
            if(last !== input.value && input.value.length > 1) {

                socket.emit("message-room", {
                    message: input.value
                })

                last = input.value;
                input.value = "";
            } 
        }
    });

    socket.on("message-room", (data) => {
        console.log(data);
    })

});