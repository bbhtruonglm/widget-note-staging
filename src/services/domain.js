let domain;
if(process.env.NODE_ENV === "production"){
    domain = "";
} else {
    domain = "";
}
export default domain