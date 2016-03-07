# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Alarm',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('MyID', models.IntegerField()),
                ('Hour', models.IntegerField()),
                ('Minute', models.IntegerField()),
                ('Am_pm', models.CharField(max_length=2)),
                ('Category', models.CharField(max_length=20)),
                ('Description', models.CharField(max_length=200)),
                ('Status', models.BooleanField()),
            ],
        ),
    ]
