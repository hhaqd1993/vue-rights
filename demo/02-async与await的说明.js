// async用于修饰一个函数，这个函数被async修饰之后，就是一个 async function
// 1. await: await关键字必须出现在async修饰的函数中
// 2. await  操作符用于等待一个Promise 对象, 暂停async函数的执行，等待promise对象成功后的结果
// 3. await如果等待的promise对象返回了失败了的结果，需要使用try..catch语法进行捕获
// 4. await所在的函数必须使用async修饰
async function fn () {
  var num = await 11
  console.log(num)
}

fn()
