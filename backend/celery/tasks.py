from celery import shared_task
from time import sleep
from backend.models import ServiceRequest, ServiceRequestRecord, User
import flask_excel
from .mail_service import send_email
from flask import render_template



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



@shared_task(bind = True, ignore_result = False)
def send_pending_reminders(self):
    service_request_records = ServiceRequestRecord.query.filter_by(status='Pending').all()
    if not service_request_records:
        return {"message": "No pending reminders found"}, 404
    for record in service_request_records:
        html_content = render_template('templates/pending_service.html', service_professional_name = record.professional.name) 
        email_reminder.apply_async(
            args = (record.professional.email, "Service Request Reminder", html_content)
        )


@shared_task(bind = True, ignore_result = False)
def send_offer_mail(self):
    all_users = User.query.all()
    for user in all_users:
        send_email(user.email, "Special Offer", "Hello, We have a special offer for you. Please check your dashboard for more details.")


@shared_task(bind = True, ignore_result = False)
def send_monthly_activity_report(self):
    users = User.query.all()
    for user in users:
        # Skip if user has no service requests
        service_requests = ServiceRequest.query.filter_by(customer_id=user.id).all()
        if not service_requests:
            continue
        # Calculate statistics
        total_requests = len(service_requests)
        completed_requests = sum(1 for req in service_requests if req.service_status == "Reviewed" or req.service_status == "Completed")
        pending_requests = sum(1 for req in service_requests if req.service_status in ["requested", "assigned"])

        # Prepare request details
        request_details = [
            {
                "id": req.id,
                "date": req.date_of_request.strftime("%Y-%m-%d"),
                "service_name": req.service.name,
                "professional_name": req.professional.name if req.professional else "N/A",
                "status": req.service_status,
                "rating": req.rating if req.rating else "N/A",
            }
            for req in service_requests
        ]

        # Prepare activity timeline
        activity_timeline = [
            {
                "date": req.date_of_request.strftime("%Y-%m-%d"),
                "description": f"{req.service.name} - {req.service_status.capitalize()}"
            }
            for req in service_requests
        ]

        # Render HTML template
        html_content = render_template(
            'templates/monthly_activity_report.html',
            user_name=user.name,
            user_email=user.email,
            account_status="Active" if user.active else "Inactive",
            total_requests=total_requests,
            completed_requests=completed_requests,
            pending_requests=pending_requests,
            request_details=request_details,
            activity_timeline=activity_timeline,
        )

        # Prepare email
        subject = "Your Monthly Activity Report - HomeHeros"
        recipient = user.email
        try:
            send_email(recipient, subject, html_content)
        except Exception as e:
            return {"message": f"Failed to send email to {user.email}: {e}"}, 500

    return {"message": "Monthly activity report sent successfully"}, 200



@shared_task(bind = True, ignore_result = False)
def send_welcome_msg_user(self, mail_id, name):
    html_content = render_template('templates/welcome_user.html', user_name = name)
    send_email(mail_id, " Welcome to HomeHeros", html_content)
    return {"message": "Welcome message sent successfully"}, 200


@shared_task(bind = True, ignore_result = False)
def send_welcome_msg_sp(self, email, name):
    html_content = render_template('templates/welcome_sp.html', professional_name = name, professional_email = email)
    send_email(email, " Welcome to HomeHeros", html_content)
    return {"message": "Welcome message sent successfully"}, 200

@shared_task(bind = True, ignore_result = False)
def send_reject_msg_sp(self, email, name):
    html_content = render_template('templates/sp_rejection.html', professional_name = name, professional_email = email)
    send_email(email, "Application Status Update", html_content)
    return {"message": "Rejection message sent successfully"}, 200

@shared_task(bind = True, ignore_result = False)
def send_approval_msg_sp(self, email, name):
    html_content = render_template('templates/sp_approval.html', professional_name = name, professional_email = email)
    send_email(email, "Application Status Update", html_content)
    return {"message": "Approval message sent successfully"}, 200

@shared_task(bind = True, ignore_result = False)
def send_block_msg(self, email, name):
    html_content = render_template('templates/block.html', user_name = name)
    send_email(email, "Account Blocked Notification", html_content)
    return {"message": "Account Blocked Notification message sent successfully"}, 200

@shared_task(bind = True, ignore_result = False)
def send_unblock_msg(self, email, name):
    html_content = render_template('templates/unblock.html', user_name = name)
    send_email(email, "Account Unblocked", html_content)
    return {"message": "Account Unblocked message sent successfully"}, 200



@shared_task(bind = True, ignore_result = False)
def send_export_complete_mail(self, email, name):
    html_content = render_template('templates/export_complete.html', user_name = name)
    send_email(email, "Export Complete", html_content)
    return {"message": "Export Complete message sent successfully"}, 200



