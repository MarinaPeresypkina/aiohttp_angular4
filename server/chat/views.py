import json
import aiohttp_jinja2

from aiohttp import web
from aiohttp_session import get_session

from settings import log
from .models import Message
from user.models import User


class IndexView(web.View):
    
    async def get(self):
        user = await User(self.request).get_user_by_token()
        if not user:
            return web.Response(text=json.dumps({"error": "Permission Denied"}), 
                content_type='application/json', 
                headers={"Access-Control-Allow-Origin": "*"}, 
                status=403)
        messages = await Message(self.request).get_list()
        return web.Response(
            text=json.dumps({"messages": messages}), 
            content_type='application/json',
            headers={"Access-Control-Allow-Origin": "*"})
        # return aiohttp_jinja2.render_template('index.html', self.request, {})


class WebSocket(web.View):

    async def get(self):
        ws = web.WebSocketResponse()
        await ws.prepare(self.request)
        nc = self.request.app.nc

        def message_handler(msg):
            ws.send_str(msg.data.decode())

        sid = await nc.subscribe("foo", cb=message_handler)

        user = await User(self.request).get_user_by_token()

        async for msg_data in ws:
            if msg_data.tp == web.MsgType.text:
                if msg_data.data == 'close':
                    await ws.close()
                    break
                if not user:
                    ws.send_json({"error": "Permission Denied"})
                    return ws
                else:
                    message = Message(self.request)
                    msg = json.loads(msg_data.data)
                    msg.update({'user': user['username']})
                    result = await message.save(user['id'], msg['message'])
                    log.debug(result)

                    await nc.publish("foo", json.dumps(result).encode('utf-8'))
            elif msg_data.tp == web.MsgType.error:
                log.debug('ws connection closed with exception %s' % ws.exception())

        log.debug('websocket connection closed')
        await nc.unsubscribe(sid)
        return ws
