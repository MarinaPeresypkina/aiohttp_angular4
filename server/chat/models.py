import os
import hashlib, binascii
import jwt
import sqlalchemy as sa

from datetime import datetime

from settings import SECRET_KEY
from user.models import User


metadata = sa.MetaData()

message = sa.Table('message', metadata,
                 sa.Column('id', sa.Integer, primary_key=True),
                 sa.Column('user_id', sa.Integer, 
                    sa.ForeignKey("users.user_id"), nullable=False),
                 sa.Column('message', sa.String(255)),
                 sa.Column('date_created', sa.DateTime, default=datetime.now())
                 )


class Message():

    def __init__(self, request, **kwargs):
        self.request = request
        self.engine = request.app.engine

    async def get_message(self, msg_id, *kw):
        conn = await self.engine.acquire()
        result = await conn.execute(message.select().where(message.c.id==msg_id[0]))
        result = await result.fetchone()
        user_model = User(self.request)
        await user_model.get_conn()
        return await self.format_object(result, user_model, result.keys())

    async def save(self, user_id, msg, *kw):
        conn = await self.engine.acquire()
        result = await conn.execute(message.insert().values(user_id=user_id,
            message=msg))
        result = await result.fetchone()
        return await self.get_message(result)

    async def get_list(self, limit=5, *kw):
        results = list()
        conn = await self.engine.acquire()
        result = await conn.execute(message.select().order_by(
            message.c.date_created.desc()).limit(limit))
        keys = result.keys()
        user_model = User(self.request)
        await user_model.get_conn()
        for res in await result.fetchall():
            results.append(await self.format_object(res, user_model, keys))
        results.reverse()
        return results

    async def format_object(self, res, user_model, keys):
        res_obj = dict()
        for key in keys:
            value = res[key]
            if isinstance(value, datetime):
                value = value.isoformat()
            elif isinstance(value, int) and key.endswith('_id'):
                value = await user_model.get_user_by_id(value)
                value = value['username']
                key = 'user'
            res_obj[key] = value
        return res_obj
