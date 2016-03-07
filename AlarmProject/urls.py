"""AlarmProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from AlarmApp.views import loadAlarm,addAlarm,updateAlarm
from AlarmApp.views import loginFunc, registerFunc
from AlarmApp.views import RedirectUser

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^alarmDefault/', TemplateView.as_view(template_name="online_clock.html")),
    url(r'^loadData/',loadAlarm, name="loadAlarm"),
    url(r'^addAlarm/',addAlarm, name="addAlarm"),
    url(r'^updateAlarm/',updateAlarm, name="updateAlarm"),
    url(r'^loginDefault/',TemplateView.as_view(template_name="login.html")),

    url(r'^alarmUser/',RedirectUser, name="redirectUser"),


    url(r'^login/',loginFunc, name="login"),
    url(r'^register/',registerFunc, name="register"),

]
