import os
import asyncio
import base64
import aiohttp_jinja2
import jinja2
import aiohttp_cors

from aiohttp import web
from aiopg.sa import create_engine
from aiohttp_session.cookie_storage import EncryptedCookieStorage
from cryptography import fernet

from nats.aio.client import Client as NATS

from sqlalchemy.engine.url import URL

from routes import routes
from settings import DATABASE, STATIC_ROOT


dsn = str(URL(**DATABASE))

loop = asyncio.get_event_loop()

loop.set_debug(True)

app = web.Application(loop=loop)

app.nc = NATS()
loop.run_until_complete(app.nc.connect(
    servers=["nats://172.17.0.2:4222"], io_loop=loop))

app.engine = loop.run_until_complete(create_engine(dsn, loop=loop))
aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('templates'))

for route in routes:
    app.router.add_route(route[0], route[1], route[2], name=route[3])
app.router.add_static('/static/', path=STATIC_ROOT, name='static')

@asyncio.coroutine
def handler(request):
    return web.Response(
        text="Hello!",
        headers={
            "X-Custom-Server-Header": "Custom data",
        })

cors = aiohttp_cors.setup(app)
resource = cors.add(app.router.add_resource("/api/messages"))

route = cors.add(resource.add_route("GET", handler), {
    "http://localhost:4200": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers=("X-Custom-Server-Header",),
        allow_headers=("AUTHORIZATION", "Content-Type"),
        max_age=3600,
    )
})

async def create_tables(engine):
    async with engine.acquire() as conn:
        await conn.execute('''CREATE TABLE IF NOT EXISTS users (
                            id serial NOT NULL PRIMARY KEY,
                            username varchar(100) NOT NULL UNIQUE,
                            password varchar(255) NOT NULL)''')

        await conn.execute('''CREATE TABLE IF NOT EXISTS message (
                            id serial NOT NULL PRIMARY KEY,
                            user_id integer NOT NULL,
                            message varchar(255),
                            date_created timestamp NOT NULL,
                            CONSTRAINT user_id_fk FOREIGN KEY(user_id) REFERENCES users (id))''')

loop.run_until_complete(create_tables(app.engine))

web.run_app(app)
