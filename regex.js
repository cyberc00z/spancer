const em1 = 'maharaj@iitb.ac.in'
// const em2 = 'maharaj@hotmail.com'
// const em3 = 'maharaj@outlook.com'
// const em4 = 'maharaj@yahoo.com'
// const em5 = 'maharaj@protonmail.com'

// //const emailRegex = /^(([^<>()[\]\\.,;:\s@gmail"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


// const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// if (em1.matchAll(emailRegex)){
//     console.log('valid')
// }
const regexp = new RegExp('ac.in','g');
let match  = regexp.exec(em1)
if (match == null){
    console.log('Please Enter your valid university email');
}
else {
    console.log('Found');
    console.log(`Found ${match[0]}`)
}