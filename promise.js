const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

const resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) reject( new TypeError('Chaining cycle detected for promise!') );
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called; // 避免别人的 promise 可能会重复调用
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return ;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, r => {
          if (called) return ;
          called = true;
          reject(r);
        })
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return ;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (error) {
      this._reject(error);
    }
  }

  _resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = FULFILLED;
      this.onFulfilledCallbacks.forEach(callback => callback());
    }
  }

  _reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
      this.onRejectedCallbacks.forEach(callback => callback());
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled( this.value );
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject( error );
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected( this.reason );
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject( error );
          }
        }, 0);
      }
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled( this.value );
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject( error );
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected( this.reason );
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject( error );
            }
          }, 0);
        });
      }
    });
    return promise2;
  }

  catch(callback) {
    return this.then(null, callback);
  }

  finally(callback) {
    return this.then(value => {
      Promise.resolve(callback()).then(() => value);
    }, reason => {
      Promise.resolve(callback()).then(() => { throw err });
    })
  }
}

Promise.resolve = function(p) {
  if (p instanceof Promise) return p;
  return new Promise((resolve, reject) => {
    resolve(p);
  })
}

Promise.reject = function(p) {
  return new Promise((resolve, reject) => reject(p));
}

Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let results = [], count = 0;
    const resolveData = (index, data) => {
      results[index] = data;
      count++;
      if (count === promises.length) resolve( results );
    }
    promises.forEach((p ,index) => {
      Promise.resolve(p).then(data => {
        resolveData(index, data);
      }, reason => {
        reject(reason);
      })
    })
  })
}

Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p).then(data => {
        resolve(data)
      }, reason => {
        reject(reason);
      })
    })
  })
}

// 测试 Promise 相关
Promise.deferred = function() {
  let result = {};
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
}
var promisesAplusTests = require("promises-aplus-tests");
promisesAplusTests(Promise, function (err) {
  console.log( 'err: ', err );
  // All done; output is in the console. Or check `err` for number of failures.
});

module.exports = {
  Promise
}

