# Generated by Django 3.1.5 on 2021-01-24 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('query', '0031_classwiseattendancestatus_posted_by'),
    ]

    operations = [
        migrations.CreateModel(
            name='Events',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('EventName', models.CharField(max_length=255)),
                ('posted_time', models.DateTimeField(auto_now_add=True)),
                ('Event_on', models.DateField(default=None)),
            ],
        ),
    ]
