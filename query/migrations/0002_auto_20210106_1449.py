# Generated by Django 3.1.5 on 2021-01-06 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('query', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TeacherUser',
            fields=[
                ('username', models.CharField(max_length=30, primary_key=True, serialize=False)),
                ('password', models.CharField(max_length=30)),
                ('email', models.EmailField(max_length=40, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='studentuser',
            name='profile',
            field=models.ImageField(default='pics/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg', upload_to='pics'),
        ),
        migrations.AddField(
            model_name='studentuser',
            name='rollno',
            field=models.CharField(default=0, max_length=10, unique=True),
            preserve_default=False,
        ),
    ]
