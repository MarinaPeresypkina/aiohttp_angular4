import os
import hashlib
import binascii
import sqlalchemy as sa
import jwt

from datetime import datetime

from settings import SECRET_KEY


metadata = sa.MetaData()

users = sa.Table('users', metadata,
                 sa.Column('id', sa.Integer, primary_key=True),
                 sa.Column('username', sa.String(100),
                           nullable=False, unique=True),
                 sa.Column('password', sa.String(255), nullable=False)
                 )


class User():

    def __init__(self, request, **kwargs):
        self.request = request
        self.engine = request.app.engine

    async def create_user(self, data, *kw):
        async with self.engine.acquire() as conn:
            if not await self.check_user(data['username'], conn):
                return {'error': 'User already exist'}
            if data['password'] == '' or data['password'] != data['confirm_password']:
                return {'error': 'Invalid password'}

            dict_data = dict()
            for key, value in data.items():
                if key in users.columns.keys():
                    dict_data[key] = value
            dict_data['password'] = self.set_password(dict_data['password'])
            result = await conn.execute(users.insert().values(dict_data))
        return await result.fetchone()

    async def login(self, data, *kw):
        async with self.engine.acquire() as conn:
            result = await conn.execute(
                users.select().where(users.c.username == data['username']))
        user = await result.fetchone()
        if user and self.check_password(data['password'], user['password']):
            return {"token": jwt.encode(
                            {"username": user['username'], "id": user['id']}, 
                            SECRET_KEY.encode(),
                            algorithm='HS256').decode("utf-8"),
                    "username": user['username']
                    }
        else:
            return {'error': 'Invalid data'}

    async def get_user_by_token(self, *kw):
        token = self.request.headers.get('Authorization', '') or self.request.GET.get('token', '')
        try:
            return jwt.decode(token, SECRET_KEY.encode(), algorithms=['HS256'])
        except:
            return False

    async def get_user_by_id(self, id, *kw):
        async with self.engine.acquire() as conn:
            result = await conn.execute(users.select().where(users.c.id == id))
        return await result.fetchone()

    async def check_user(self, username, conn, *kw):
        result = await conn.execute(
            users.select().where(users.c.username == username))
        user = await result.fetchone()
        if not user:
            return True

    def set_password(self, password):
        dk = hashlib.pbkdf2_hmac(
            'sha256', password.encode(), SECRET_KEY.encode(), 100000)
        password = binascii.hexlify(dk)
        return password.decode()

    def check_password(self, user_password, db_password):
        return db_password == self.set_password(user_password)
