from flask import current_app as app
from werkzeug.utils import secure_filename
from flask_security import auth_required, verify_password, hash_password
from flask import request, jsonify, render_template, send_file
from backend.models import db
from datetime import datetime
from celery.result import AsyncResult
from backend.celery.tasks import create_csv
import os

datastore = app.security.datastore
cache = app.cache

IMAGE_UPLOAD_FOLDER = 'source/images'
RESUME_UPLOAD_FOLDER = 'source/resume'
os.makedirs(IMAGE_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESUME_UPLOAD_FOLDER, exist_ok=True)


@app.get('/cache')
@cache.cached(timeout=5)
def cache():
    return {"message": "Cache is working", "time": datetime.now()}

@app.get('/create-csv')
def createCsv():
    result = create_csv.delay()
    return {"message": "Celery is working", "task_id": result.id}

@app.get('/get-celery-data/<task_id>')
def get_celery_data(task_id):
    result = AsyncResult(task_id)
    if result.ready():
        return send_file(f'./backend/celery/user-downloads/{result.result}'), 200
    else:
        return {'message' : 'task not ready'}, 405
    


@app.get('/')
def home():
    return render_template('index.html')

@app.get('/protected')
@auth_required('token')
def protected():
    return "Only Accessible to authemticated user"


@app.route('/login', methods = ['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email  or not password:
        return jsonify({"message":"Missing Email or Password"}), 404
    user = datastore.find_user(email = email)
    if not user:
        return jsonify({"message": "Invalid User"}), 404
    if not user.active:
        return jsonify({"message": "User is not active"}), 400
    if verify_password(password, user.password):
        return jsonify({"token": user.get_auth_token(), "email" : user.email, "role": user.roles[0].name, "id": user.id }), 200
    return jsonify({"message": "wrong password"}), 400
    
@app.route('/register', methods=['POST'])
def register():
    data = request.form  # Use request.form instead of request.get_json()
    email = data.get('email')
    password = data.get('password')
    role_name = data.get('roles')
    name = data.get('name')
    description = data.get('description')
    service_type = data.get('service_type')
    experience = data.get('experience')
    location = data.get('location')
    image = request.files.get('image')
    resume = request.files.get('resume')

    if not email or not password or role_name not in ['admin', 'user', 'professional']:
        return jsonify({"message": "Missing Email or Password"}), 404
    
    user = datastore.find_user(email=email)
    if user:
        return jsonify({"message": "User Already Exists!"}), 404

    if role_name == 'professional':
        if not all([name, description, service_type, experience, location, image, resume]):
            return jsonify({"message": "All fields are required for professional role"}), 404
    
    try:
        image_filename = None
        resume_filename = None

        if image:
            image_filename = secure_filename(image.filename)
            image.save(os.path.join(IMAGE_UPLOAD_FOLDER, image_filename))

        if resume:
            resume_filename = secure_filename(resume.filename)
            resume.save(os.path.join(RESUME_UPLOAD_FOLDER, resume_filename))

        datastore.create_user(
            email=email,
            password=hash_password(password),
            active=False,
            roles=[role_name],
            name=name,
            description=description,
            service_type=service_type,
            experience=experience,
            location=location,
            image=image_filename,
            resume=resume_filename,
            status = "Pending Approval"
        )
        db.session.commit()
        return jsonify({"Message": "Registration successful"}), 200
    except Exception as err:
        db.session.rollback()
        return jsonify({"Message": "Something went wrong", "error": str(err)}), 400