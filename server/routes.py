from user.views import LoginView, SignInView, SignOutView
from chat.views import WebSocket, IndexView


routes = [
        ('POST','/api/signin', SignInView, 'signin'),
        ('GET','/api/signout', SignOutView, 'signout'),
        ('POST','/api/login', LoginView, 'login'),
        ('GET', '/ws', WebSocket, 'chat'),
        ('GET', '/api/messages', IndexView, 'index'),]
