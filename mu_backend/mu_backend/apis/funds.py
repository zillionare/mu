import logging
from typing import Union

from omicron.models.funds import FundNetValue, FundPortfolioStock, Funds
from sanic import response
from sanic.blueprints import Blueprint
from sanic.request import Request

bp = Blueprint("funds", url_prefix="api/funds")

logger = logging.getLogger(__name__)


@bp.route("/", methods=["POST"])
async def get_fund_list(request: Request):
    data = request.json
    page = data.get("page") or 1
    page_size = data.get("page_size") or 10
    name: str = data.get("name")
    code: Union[str, list[str]] = data.get("code") or []
    operate_mode_ids: list[int] = data.get("operate_mode_id")
    total_tna_min = data.get("total_tna_min")
    total_tna_max = data.get("total_tna_max")
    postion_stock = data.get("postion_stock")
    orders = data.get("sorter", [])
    underlying_asset_type = data.get("underlying_asset_type", "")
    position_symbol = data.get("position_symbol", [])
    fund_range = data.get("fund_range")
    position_stock_percent = data.get("position_stock_percent")
    data = await Funds.get(
        name,
        code,
        operate_mode_ids,
        total_tna_min,
        total_tna_max,
        postion_stock,
        underlying_asset_type,
        position_symbol,
        fund_range,
        position_stock_percent,
        orders,
        page,
        page_size,
    )

    return response.json(
        {
            "code": 0,
            "data": data,
            "msg": "操作成功",
        }
    )


@bp.route("/net_values", methods=["POST"])
async def get_fund_net_values(request: Request):

    items = []
    data = request.json
    code = data.get("code")

    q = FundNetValue.select(
        "id",
        "code",
        "net_value",
        "sum_value",
        "factor",
        "acc_factor",
        "refactor_net_value",
        "day",
    ).where(FundNetValue.code.in_([code]))
    result = q.order_by(FundNetValue.day.desc()).offset(0).limit(500)
    records = await result.gino.all()
    for record in records:
        item = dict()
        item["id"] = record["id"]
        item["code"] = record["code"]
        item["net_value"] = record["net_value"]
        item["sum_value"] = record["sum_value"]
        item["factor"] = record["factor"]
        item["acc_factor"] = record["acc_factor"]
        item["refactor_net_value"] = record["refactor_net_value"]
        item["day"] = record["day"] and record["day"].strftime("%Y-%m-%d")
        items.append(item)
    return response.json(
        {"code": 0, "data": {"items": items, "count": len(items)}, "msg": "操作成功"}
    )


@bp.route("/fund_portfolio_stock", methods=["POST"])
async def get_fund_portfolio_stock(request: Request):
    items = []
    data = request.json
    code = data.get("code")
    symbol = data.get("symbol")
    items = await FundPortfolioStock.get(code, symbol)
    return response.json(
        {"code": 0, "data": {"items": items, "count": len(items)}, "msg": "操作成功"}
    )
