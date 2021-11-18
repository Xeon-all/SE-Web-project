from django.db import models

# Create your models here.

from django.db import models
 
class Test(models.Model):
    name = models.CharField(max_length=20,default='')
    password = models.CharField(max_length=20,default='')
    task = models.CharField(max_length=20,default='')