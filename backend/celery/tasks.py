from celery import shared_task
from time import sleep
from backend.models import ServiceRequest
import flask_excel
from .mail_service import send_email


@shared_task(bind = True, ignore_result = False)
def create_csv(self):
    resource = ServiceRequest.query.all()
    if not resource:
        return {"message": "No service requests found"}, 404
    column_names = [column.name for column in ServiceRequest.__table__.columns]
    print(column_names)
    csv_out = flask_excel.make_response_from_query_sets(
        query_sets=resource,
        column_names=column_names,
        file_type='csv'
    )
    print("csv out")

    task_id = self.request.id
    file_name = f'service_requests_{task_id}.csv'

    # Writing the response content to a file
    with open(f'./backend/celery/user-downloads/{file_name}', 'wb') as f:
        f.write(csv_out.data)
    
    return file_name


@shared_task(bind = True, ignore_result = False)
def email_reminder(self, to, subject, content):
    send_email(to, subject, content)
    return {"message": "Email sent successfully"}, 200