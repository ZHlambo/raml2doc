export const parseDataSource = (state, dataSource, key) => {
  state[key + "NoMore"] = Boolean(dataSource.length == 0 || dataSource.length < state[key + "Filter"].limit)
  let isNext = getVOO(state, `${key}Filter.offset`);
  if (isNext) {
    state[key] = state[key].concat(dataSource)
  } else {
    return {
      ...state,
      [key]: dataSource
    }
  }
  return {
    ...state
  };
}

export const getVOO = (obj, keys) => {
  let value;
  keys = keys && keys.split(".");
  if (keys instanceof Array && keys.length > 0) {
    value = obj;
    for (let i = 0; i < keys.length; i++) {
      if (!value) return value;
      value = value[keys[i]];
    }
  }
  return value;
}

export const updateElement = (dataSource, key, obj, keepOn) => {
  if (!dataSource || !obj)
    return;
  for (let i = 0; i < dataSource.length; i++) {
    if (getVOO(dataSource[i], key) == getVOO(obj, key)) {
      Object.assign(dataSource[i], obj);
      if (!keepOn)
        return dataSource[i];
      }
    }
}

export const deleteElement = (dataSource, key, value, keepOn) => {
  if (!dataSource || !value)
    return;
  value = typeof value == "object" ? getVOO(value, key) : value;
  for (let i = 0; i < dataSource.length; i++) {
    if (getVOO(dataSource[i], key) == value) {
      dataSource.splice(i, 1);
      i--;
      if (!keepOn)
        return dataSource;
      }
    }
  return dataSource;
}

export const formatterDate = (date) => {
  date = new Date(date);
  let FullYear = date.getFullYear() > 10 ? date.getFullYear() : "0" + date.getFullYear();
  let Month = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
  let Day = date.getDay() > 10 ? date.getDay() : "0" + date.getDay();
  let Hours = date.getHours() > 10 ? date.getHours() : "0" + date.getHours();
  let Minutes = date.getMinutes() > 10 ? date.getMinutes() : "0" + date.getMinutes();
  let Seconds = date.getSeconds() > 10 ? date.getSeconds() : "0" + date.getSeconds();
  date = /* FullYear + "-" + */ Month + "-" + Day + " " + Hours + ":" + Minutes /* + ":" + Seconds */;
  return date;
}
