# -*- coding: utf-8 -*-
 
from django.shortcuts import render
from django.views.decorators import csrf
from django.http import HttpResponse

from app01.models import app
 
# 接收POST请求数据
def create_user(request):
    #if request.POST:
        #_name = request.POST['name']
        #_password = request.POST['password']
        _name = request.POST.get('name')
        _password = request.POST.get('password')
        if app.objects.filter(name=_name).exists() :
            return HttpResponse("<p>" + "already have the name" + "</p>")
        print(_name,_password)
        user = app(name=_name,password=_password)
        user.save()
        return HttpResponse("<p>" + "sucess" + "</p>")
    #else :
        #return "fail"

        
