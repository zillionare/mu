#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Author: Aaron-Yang [code@jieyu.ai]
Contributors:
"""
import logging

import cfg4py
import fire
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sanic import Blueprint, Sanic
from apis import funds
from config import get_config_dir

cfg = cfg4py.get_instance()

app = Sanic("MuBackend")

logger = logging.getLogger(__name__)


class Omega(object):
    def __init__(self, **kwargs):
        self.port = kwargs.get("port")
        self.gid = kwargs.get("account")

        self.params = kwargs
        self.inherit_cfg = {}

    async def init(self, *args):
        logger.info("init %s", self.__class__.__name__)

        cfg4py.init(get_config_dir(), False)
        cfg4py.update_config(self.inherit_cfg)

        interfaces = Blueprint.group(funds.bp)
        app.blueprint(interfaces)


def start():
    omega = Omega()

    app.register_listener(omega.init, "before_server_start")

    logger.info("starting sanic group listen on %s with %s workers", 3001, 1)
    app.run(debug=True)
    logger.info("sanic stopped.")


if __name__ == "__main__":
    start()
