from django.shortcuts import render
from AlarmApp.models import  Alarm
from AlarmApp.models import UserandPass
from django.http import HttpResponse
from django.conf import settings



# Create your views here.
def loadAlarm(request):
    alarms = Alarm.objects.filter(User=settings.DefaultUserName)
    result =""
    for alarm in alarms:
        result+=str(alarm.MyID)+","
        result+=str(alarm.Hour)+","
        result+=str(alarm.Minute)+","
        result+=alarm.Am_pm+","
        result+=alarm.Category+","
        result+=alarm.Description+","
        result+=str(alarm.Status)+";"
    return HttpResponse(result)




def addAlarm(request):
    try:
        MyID = request.GET["MyID"]
        Hour = request.GET["Hour"]
        Minute = request.GET["Minute"]
        Am_pm = request.GET["Am_pm"]
        Category = request.GET["Category"]
        Description = request.GET["Description"]
        Status = request.GET["Status"]
        if Status=="true":
            Status = True
        else :
            Status = False
        newAlarm = Alarm(MyID=MyID,Hour=Hour,Minute=Minute,Am_pm=Am_pm,Category=Category,Description=Description,Status=Status,User=settings.DefaultUserName)
        newAlarm.save()
        return HttpResponse("OK")
    except:
        return HttpResponse("Failed")


def updateAlarm(request):
    try:
        MyID = request.GET["MyID"]
        Status = request.GET["Status"]
        if Status=="true":
            Status = True
        else :
            Status = False
        alarm = Alarm.objects.get(MyID=MyID,User = settings.DefaultUserName)
        alarm.Status=Status
        alarm.save()
        return HttpResponse("ok")
    except:
        return HttpResponse("fail")





def loginFunc(request):
    try:
        userName = request.GET["UserName"]
        password = request.GET["Password"]

        combination = UserandPass.objects.get(UserName=userName)
        if (combination.Password == password):
            return HttpResponse("password passed")
        else:
            return HttpResponse("password failed")
    except:
        return HttpResponse("no such user")




def registerFunc(request):
    try:
        userName = request.GET["UserName"]
        password = request.GET["Password"]
        # find if user exists
        try:
            combination = UserandPass.objects.get(UserName=userName)
        except:
            newUser = UserandPass(UserName=userName, Password=password)
            newUser.save()
            return HttpResponse("user registered")


        # if user wants to change password
        oldPassword = combination.Password
        if (oldPassword == password):
            return HttpResponse("user exists")
        else:
            newUser = UserandPass(UserName=userName, Password=password)
            newUser.save()
            return HttpResponse("password changed")

    except:
        return HttpResponse("fail")




def RedirectUser(request):
    try:
        settings.DefaultUserName = request.GET["UserName"]
        return HttpResponse(settings.DefaultUserName)

    except:
        return HttpResponse("no such user")

















