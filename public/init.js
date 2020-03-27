/**
 * Global access to the socket variable. Previously I had this setup in every class that
 * called the socket, but that will make each event on the server side get called multiple
 * times depending on how many times you initialized the socket variable.
 */

var socket = io("http://localhost:4000");