export default{
  beforeFunction: null, // 订阅者,
  go(to){
    let from={name:"当前页"}
    this.beforeFunction.call(this, to, from).then(()=>{
      console.log("跳转")
    })
    
  },
  beforeFunction(to,from){
    console.log(from)
    console.log(to)
    return new Promise((resolve,reject)=>{
      setTimeout(function(){
        console.log("跳转前")
        resolve()
      },2000)
    })
  }
}