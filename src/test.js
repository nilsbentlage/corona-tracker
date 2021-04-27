let string = "2021-04-25T23:00:00.000Z"
let firstMove = string.replace('T', ' | ').slice(0, -8)
let secondMove = firstMove
console.log(secondMove)