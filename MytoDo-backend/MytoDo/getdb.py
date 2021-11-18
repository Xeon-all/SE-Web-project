# -*- coding: utf-8 -*-
 
from typing import List
from django.http import HttpResponse
 
from app01.models import app
 
# 数据库操作
def getdb(request):
    # 初始化
    response = ""
    response1 = ""
    
    
    # 通过objects这个模型管理器的all()获得所有数据行，相当于SQL中的SELECT * FROM
    #list = app.objects.all()
        
    # filter相当于SQL中的WHERE，可设置条件过滤结果
    #response2 = app.objects.filter(id=1) 
    
    # 获取单个对象
    #response3 = app.objects.get(id=1) 
    
    # 限制返回的数据 相当于 SQL 中的 OFFSET 0 LIMIT 2;
    #app.objects.order_by('name')[0:2]
    
    #数据排序
    #app.objects.order_by("id")
    
    # 上面的方法可以连锁使用
    #app.objects.filter(name="runoob").order_by("id")

     # 输出所有数据
    #for var in list:
        #response1 += var.name + " "
    #response = response1

    #return HttpResponse("<p>" + response + "</p>")
    #return HttpResponse(list)

    request.encoding='utf-8'

    if 'name' in request.GET and request.GET['name']:
        name = request.GET['name']
    else:
        return HttpResponse("<p>" + "Wrong name" + "</p>")

    user=app.objects.get(name=name) 

    if 'password' in request.GET and request.GET['password']:
        password = request.GET['password']
        if password!=user.password:
            return HttpResponse("<p>" + "Wrong password" + "</p>")
    else:
        return HttpResponse("<p>" + "No password" + "</p>")
    
    print(user.name,user.password,user.task)

    return HttpResponse("<p>" + user.task + "</p>")


    