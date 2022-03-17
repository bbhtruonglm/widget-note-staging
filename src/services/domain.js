let domain;
if(process.env.NODE_ENV === "production"){
    domain = "https://chatbox-note-schedule.botbanhang.vn";
} else {
    // domain = "http://192.168.1.81:1337";
    // domain = "https://sandbox.merchant.vn/note-api";
    domain = "https://chatbox-note-schedule.botbanhang.vn";
}
export default domain