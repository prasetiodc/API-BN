module.exports = {
  checkPass(password) {
    const regexAtLeastOneNumber = /\d/
    const regexAtLeastOneSmall = /[a-z]/
    const regexAtLeastOneCapital = /[A-Z]/
    const regexAtLeastOneSymbol = /[$-/:-?{-~!"^_`\[\]]/
    let statusPassword = true
    
    if (password.length < 6 || !regexAtLeastOneNumber.test(password) || !regexAtLeastOneSmall.test(password) || !regexAtLeastOneCapital.test(password) || regexAtLeastOneSymbol.test(password)) {
      statusPassword = false
    }

    return statusPassword
  }
}