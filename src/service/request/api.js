import axios from "./http";
import _ from "lodash";
import { camelCase, snakeCase } from "../../utils/utils";

const getFunds = async (query, pagination, filters, sorter) => {
  let queryParams = {};
  if (!_.isEmpty(query)) {
    queryParams = { ...query, ...queryParams };
  }
  if (!_.isEmpty(pagination)) {
    const { current: page, pageSize } = pagination;
    queryParams = { ...queryParams, page, pageSize };
  }
  if (!_.isEmpty(sorter)) {
    sorter = _.map(
      _.filter(sorter, (row) => !!row.order),
      ({ field, order }) => {
        return { field: _.snakeCase(field), order: _.replace(order, "end", "") };
      }
    );
    Object.assign(queryParams, { sorter });
  }
  const {
    data: {
      data: { items, count },
    },
  } = await axios.post("/api/funds", { ...snakeCase(queryParams) });
  return { items: camelCase(items), totalCount: count };
};

const getFundNetValues = async (query) => {
  const {
    data: {
      data: { items },
    },
  } = await axios.post("/api/funds/net_values", { ...query });
  return { items: camelCase(items) };
};

const getFundPortfolioStock = async ({ code, symbol }) => {
  const {
    data: { data: { items } }
  } = await axios.post("/api/funds/fund_portfolio_stock", { code, symbol })
  return { items: camelCase(items) }
}

export { getFunds, getFundNetValues, getFundPortfolioStock };
