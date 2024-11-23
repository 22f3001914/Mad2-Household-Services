from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password
from flask import current_app as app

with app.app_context():
    db.create_all()
    userdatastore: SQLAlchemyUserDatastore = app.security.datastore
    userdatastore.find_or_create_role(name='admin', description='superuser')
    userdatastore.find_or_create_role(name='user', description='customer')
    userdatastore.find_or_create_role(name='professional', description='service_professional')

    if not userdatastore.find_user(email='admin@study.iitm.ac.in'):
        userdatastore.create_user(email='admin@study.iitm.ac.in', password=hash_password('pass'), roles=['admin'])

    if not userdatastore.find_user(email='user01@study.iitm.ac.in'):
        userdatastore.create_user(email='user01@study.iitm.ac.in', password=hash_password('pass'), roles=['user'])

    if not userdatastore.find_user(email='sp01@gmail.com'):
        userdatastore.create_user(
            email='sp01@gmail.com',
            password=hash_password('pass'),
            fs_uniquifier='unique-identifier-professional01',  # Ensure this is unique
            roles=['professional'],
            name='John Doe',
            description='Experienced AC technician',
            service_type='AC Servicing',
            experience=5,
            location='12345',
            image='path/to/image.jpg',
            resume='path/to/resume.pdf',
            status='Active'
        )

    db.session.commit()