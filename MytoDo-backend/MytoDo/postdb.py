# -*- coding: utf-8 -*-
 
from django.shortcuts import render
from django.views.decorators import csrf
from django.http import HttpResponse

from app01.models import app
 
# 接收POST请求数据
def postdb(request):
    if request.POST:
        _name = request.POST.get('name')
        _password = request.POST.get('password')
        user=app.objects.get(name=_name) 
        if _password==user.password:
            _task=request.POST.get('task')
            #print(_task)
            user.task=_task
            user.save()
            return HttpResponse("<p>" + "sucess" + "</p>")

        
