export default class Middleware {
  _use(fn) {
    this.go = (stack => (val, _next) =>
      stack(val, () => {
        fn.apply(this, [val, _next.bind.apply(_next, [null, val])])
      }))(this.go)
  }

  use(...fns) {
    fns.forEach(fn => {
      if (fn instanceof Array) {
        this.use(...fn)
      } else {
        this._use(fn)
      }
    })
  }

  go(val, _next) {
    _next.apply(this, val)
  }
}
