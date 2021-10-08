// import request from 'request'
// import domain from './domain'


// export default {
//     post: (path, body, headers, proceed) => {

//         request.post({
//             url: domain + path,
//             body: body,
//             headers: headers,
//             json: true,
//         }, function (e, r, b) {
//             return proceed(e, r, b)
//         });
//     },
//     get: (path, headers, proceed) => {

//         request.get({
//             url: domain + path,
//             headers: headers,
//             json: true,
//         }, function (e, r, b) {
//             return proceed(e, r, b)
//         });
//     },
// }