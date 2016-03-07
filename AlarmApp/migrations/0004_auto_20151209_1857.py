# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AlarmApp', '0003_auto_20151209_0324'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userandpass',
            name='id',
        ),
        migrations.AddField(
            model_name='alarm',
            name='User',
            field=models.CharField(default='tutu', max_length=10),
        ),
        migrations.AlterField(
            model_name='userandpass',
            name='UserName',
            field=models.CharField(max_length=10, primary_key=True, serialize=False),
        ),
    ]
