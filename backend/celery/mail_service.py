import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class DummyMailConfig:
    SMTP_SERVER = "localhost"
    SMTP_PORT = 1025
    SENDER_EMAIL = 'influeverse@gmail.com'
    SENDER_PASSWORD = ''

class MailConfig:
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SENDER_EMAIL = 'influeverse@gmail.com'
    SENDER_PASSWORD = 'ovhq dhis hnef nbme'

def send_email(to, subject, content, config = DummyMailConfig):
    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = config.SENDER_EMAIL

    msg.attach(MIMEText(content, 'html'))

    with smtplib.SMTP(host=config.SMTP_SERVER, port=config.SMTP_PORT) as client:
        if config.SMTP_SERVER != "localhost":
            client.starttls()
            client.login(config.SENDER_EMAIL, config.SENDER_PASSWORD)
        client.send_message(msg)
        client.quit()


# config = DummyMailConfig
# config = MailConfig
# send_email('aditya@example.com', 'Test Email', '<h1> Welcome to AppDev </h1>', config)

