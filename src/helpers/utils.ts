export function handleOutputPaging(data: any, totalItems: number, params, metadata = {}) {
  return {
    data,
    totalItems,
    paging: true,
    pageIndex: params.pageIndex,
    totalPages: Math.ceil(totalItems / params.take),
    hasMore: data ? (data.length < params.take ? false : true) : false,
    metadata,
  };
}

export function handleInputPaging(params) {
  params.pageIndex = Number(params.pageIndex) || 1;
  params.take = Number(params.take) || 10;
  params.skip = (params.pageIndex - 1) * params.take;
  return params;
}
