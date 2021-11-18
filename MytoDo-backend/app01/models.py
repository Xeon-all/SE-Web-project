from django.db import models

# Create your models here.

class app(models.Model):
    name = models.CharField(max_length=20,default='')
    password = models.CharField(max_length=20,default='')
    task = models.CharField(max_length=20,default='')