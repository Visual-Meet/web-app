# Generated by Django 3.1.5 on 2021-01-16 19:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('query', '0014_auto_20210116_1954'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='teacheruser',
            name='sectiont',
        ),
        migrations.AddField(
            model_name='teacheruser',
            name='section',
            field=models.CharField(default=None, max_length=5),
            preserve_default=False,
        ),
    ]