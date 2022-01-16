#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author: Aaron-Yang [code@jieyu.ai]
Contributors:
"""
import logging

import cfg4py
from apis import funds
from config import get_config_dir
from omicron.dal import init as init_db
from sanic import Blueprint, Sanic
from sanic_cors import CORS

cfg = cfg4py.get_instance()

app = Sanic("MuBackend")
CORS(app)

logger = logging.getLogger(__name__)


class MuBackend(object):
    async def init(self, *args):
        logger.info("init %s", self.__class__.__name__)

        cfg4py.init(get_config_dir(), False)

        await init_db(cfg.postgres.dsn)

        logger.info("<<< init %s process done", self.__class__.__name__)


def start():
    mu_backend = MuBackend()
    app.register_listener(mu_backend.init, "BEFORE_SERVER_START")
    interfaces = Blueprint.group(funds.bp)
    app.blueprint(interfaces)
    app.run(
        host="0.0.0.0",
        workers=1,
        register_sys_signals=True,
    )
    logger.info("sanic stopped.")


if __name__ == "__main__":
    start()
