import json

from aiohttp import web
from aiohttp_session import get_session

from .models import User


class LoginView(web.View):

    async def post(self):
        data = await self.request.json()
        result = await User(self.request).login(data)
        if 'error' in result:
            return web.Response(text=json.dumps(result), 
                content_type='application/json', 
                headers={"Access-Control-Allow-Origin": "*"}, 
                status=400)
        return web.Response(text=json.dumps(result), 
            content_type='application/json',
            headers={"Access-Control-Allow-Origin": "*"})


class SignInView(web.View):

    async def post(self):
        data = await self.request.json()
        result = await User(self.request).create_user(data)
        if 'error' in result:
            return web.Response(text=json.dumps(result), 
                content_type='application/json', 
                headers={"Access-Control-Allow-Origin": "*"}, 
                status=400)
        return web.Response(text=json.dumps({"success": True}), 
            content_type='application/json',
            headers={"Access-Control-Allow-Origin": "*"})


class SignOutView(web.View):

    async def get(self):
    #     session = await get_session(self.request)
    #     if session.get('user'):
    #         del session['user']
        return {"success": True}
