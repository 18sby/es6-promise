const { Promise } = require('./promise');

let p = new Promise((resolve, reject) => {
  resolve('success');
  resolve('fail');
});
p.then(v => {
  console.log('v: ', v);
}, r => {
  console.log( 'r: ', r);
}).finally(function() {
  console.log( 'finally inner' );
})

// let p = new Promise((resolve, reject) => {
//   reject('fail');
// });
// p.catch(err => {
//   console.log('err: ', err);
// })

// let p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(100);
//   }, 1000);
// });
// let p2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(200);
//   }, 2000);
// });
// let p3 = new Promise((resolve, reject) => {
//   resolve(300);
// });

// Promise.race([p1,p2,p3]).then(value => {
//   console.log( 'value: ' , value);
// }, reason => {
//   console.log( 'reason: ' , reason);
// })

// Promise.all([p1,p2,p3]).then(value => {
//   console.log( 'value: ' , value);
// }, reason => {
//   console.log( 'reason: ' , reason);
// })

// let p = Promise.resolve(new Promise((resolve, reject) => {
//   resolve(200);
// }));
// console.log( 'p: ', p );

// let p = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(100);
//   }, 1000);
// })
// p.then(value => {
//   console.log( 'p 成功: ', value );
//   return '200';
// }, reason => {
//   console.log( 'p 失败: ', reason );
// }).then(value => {
//   console.log( '第二个 promise 成功: ', value );
// }, reason => {
//   console.log( '第二个 promise 失败: ', reason );
// })
// console.log( 'p: ', p );