let arrowFn = ()=>{
    console.log('箭头函数执行了')
}

arrowFn()

// let p = new Promise(function(resolve,reject){
//     setTimeout(function(){
//         console.log('10s')
//         resolve(1)
//     },1000)
// })

// p.then(function(data){
//     console.log(data)
// })