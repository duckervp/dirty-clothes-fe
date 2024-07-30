export const toList = (arr, key) => {
    if (!arr) return [];
    const newArr = arr.map(item => item[key]);
    return newArr.filter((item,
        index) => newArr.indexOf(item) === index);
}

export const toListObj = (org, idKey, nameKey) => {
    if (!org) return [];
    const newArr = org.map((item) => ({ id: item[idKey], name: item[nameKey] }));
    return newArr.filter((value, index, self) => index === self.findIndex((t) => t.id === value.id));
  };