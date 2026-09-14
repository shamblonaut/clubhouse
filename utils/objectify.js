function objectArrayToObject(objectArray, keyName, valueName) {
  const object = {};
  for (const item of objectArray) {
    const key = item[keyName];
    delete item[keyName];
    object[key] = item;
  }
  return object;
}

export default objectArrayToObject;
