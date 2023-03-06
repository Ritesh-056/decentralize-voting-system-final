function modifyUserInputStr(userInputStr) {
  const firstCharIndex = userInputStr.charAt(0).toUpperCase(); 
  const modifiedUserInput = firstCharIndex + userInputStr.slice(1).toLowerCase();
  return modifiedUserInput;
}
