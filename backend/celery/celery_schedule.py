from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import email_reminder, send_pending_reminders, send_offer_mail
celery_app = app.extensions['celery']

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):

    # sender.add_periodic_task(10.0, email_reminder.s('aditya@example.com', 'Test Email', '<h1> Welcome to AppDev </h1>'), name='add every 10')

    # Daily email reminder at 8:00 AM
    sender.add_periodic_task(
        crontab(hour=19, minute=18),
        email_reminder.s('daily@example.com', 'Daily Email', '<h1> Daily Reminder </h1>'),
        name='send daily email'
    )
    sender.add_periodic_task(
        crontab(hour=1, minute=28),
        send_pending_reminders.s(),
        name='send pending reminders'
    )
    sender.add_periodic_task(
        crontab(hour=1, minute=28),
        send_pending_reminders.s(),
        name='send pending reminders'
    )
    sender.add_periodic_task(
        crontab(hour=1, minute=34),
        send_offer_mail.s(),
        name='send offer reminders'
    )

    # Weekly email reminder every Monday at 8:00 AM
    sender.add_periodic_task(
        crontab(hour=8, minute=0, day_of_week='monday'),
        email_reminder.s('weekly@example.com', 'Weekly Email', '<h1> Weekly Reminder </h1>'),
        name='send weekly email'
    )

    # Monthly email reminder on the 1st of every month at 8:00 AM
    sender.add_periodic_task(
        crontab(hour=8, minute=0, day_of_month='1'),
        email_reminder.s('monthly@example.com', 'Monthly Email', '<h1> Monthly Reminder </h1>'),
        name='send monthly email'
    )

