# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AlarmApp', '0002_users'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Users',
            new_name='UserandPass',
        ),
    ]
