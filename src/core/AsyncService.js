
let _timeout

function setDelayedCall (ms, resolve) {
  _timeout = setTimeout(resolve, ms)
}

function cancelDelayedCall () {
  clearTimeout(_timeout)
}

export {
  setDelayedCall,
  cancelDelayedCall
}
