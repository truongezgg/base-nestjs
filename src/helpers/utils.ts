import * as flatten from 'flat';

export function handleOutputPaging(data: any, totalItems: number, params, metadata = {}) {
  return {
    data,
    totalItems,
    pageIndex: params.pageIndex,
    totalPages: Math.ceil(totalItems / params.take),
    hasMore: data ? (data.length < params.take ? false : true) : false,
    ...metadata,
  };
}

export function handleInputPaging(params) {
  params.pageIndex = Number(params.pageIndex) || 1;
  params.take = Number(params.take) || 10;
  params.skip = (params.pageIndex - 1) * params.take;
  return params;
}

//! "When i wrote this code, only me and God knew how it works. Now only God knows..."
export function reformatFileLanguage(data: Array<any>, params: { code?: string; environment: string }) {
  const groupByLanguageCode = convertToObject(data, 'code');

  const languageObject = Object.keys(groupByLanguageCode).reduce((acc, cur) => {
    acc[cur] = groupByLanguageCode[cur].reduce((ac, cu) => {
      ac[cu.key] = cu.value;
      return ac;
    }, {});
    return acc;
  }, {});

  const result = flatten.unflatten(languageObject);
  if (params.code) {
    return result[params.code];
  }
  return result;
}

export function convertToObject(data: Array<Object>, key: string): { [key: string]: Array<any> } {
  const result = {};
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    const keyEl = element[key];
    if (!result[keyEl]) {
      result[keyEl] = [];
    }
    delete element[key];
    result[keyEl].push(element);
  }
  return result;
}
