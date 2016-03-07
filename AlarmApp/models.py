from django.db import models

# Create your models here.
class Alarm(models.Model):
    MyID = models.IntegerField()
    Hour = models.IntegerField()
    Minute = models.IntegerField()
    Am_pm = models.CharField(max_length=2)
    Category = models.CharField(max_length=20)
    Description = models.CharField(max_length=200)
    Status = models.BooleanField()
    User = models.CharField(max_length=10, default="tutu")


class UserandPass(models.Model):
    UserName = models.CharField(max_length = 10, primary_key=True)
    Password = models.CharField(max_length = 20)