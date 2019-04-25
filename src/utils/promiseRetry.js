const retry = (func, resolve, reject, retry_msg) => {
  func()
    .then(resolve)
    .catch(() => {
      console.warn(retry_msg)
      setTimeout(() => retry(func, resolve, reject, retry_msg), 1000)
    })
}

const promiseRetry = (func, retry_msg = 'Promise rejected. Retrying...') =>
  new Promise((resolve, reject) => {
    retry(func, resolve, reject, retry_msg)
  }) //Returns a Promise that allways retries itself

export default promiseRetry
