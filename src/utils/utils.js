import _ from "lodash";

let camelCase = (data) => {
  if (_.isArray(data)) {
    return _.map(data, (row) => camelCase(row));
  }
  const result = {};
  for (const item of Object.keys(data)) {
    result[_.camelCase(item)] = data[item];
  }
  return result;
};


let snakeCase = (data) => {
    if (_.isArray(data)) {
      return _.map(data, (row) => snakeCase(row));
    }
    const result = {};
    for (const item of Object.keys(data)) {
      result[_.snakeCase(item)] = data[item];
    }
    return result;
  };


export {
    camelCase, 
    snakeCase
}
