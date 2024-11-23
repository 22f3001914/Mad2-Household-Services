from flask import jsonify, request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.models import Service, ServiceRequest, db, User, ServiceRequestRecord
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import current_app as app
import os 
cache = app.cache

api = Api(prefix='/api')

# Define the structure for marshaling Service fields
service_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'base_price': fields.Float,
    'time_required': fields.String,
    'description': fields.String,
    'date_created': fields.DateTime,
    'image': fields.String,
}

# Define the structure for marshaling ServiceRequest fields
service_request_fields = {
    'id': fields.Integer,
    'service_id': fields.Integer,
    'customer_id': fields.Integer,
    'professional_id': fields.Integer,
    'date_of_request': fields.DateTime,
    'date_of_completion': fields.DateTime,
    'service_status': fields.String,
    'remarks': fields.String,
    'rating': fields.Integer,
}

# Define the structure for marshaling User fields
def get_user_role(user):
    if user.is_service_professional():
        return 'Service Professional'
    elif user.is_customer():
        return 'User'
    return None

user_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'name': fields.String,
    'date_created': fields.DateTime,
    'description': fields.String,
    'service_type': fields.String,
    'experience': fields.Integer,
    'location': fields.String,
    'image': fields.String,
    'resume': fields.String,
    'role': fields.String(attribute=lambda x: get_user_role(x)),
    'active': fields.Boolean,
    'status': fields.String,
}
class ServiceAPI(Resource):
    # @auth_required('token')
    @cache.memoize(timeout=5)
    @marshal_with(service_fields)
    def get(self, service_id=None):
        if service_id:
            service = Service.query.get(service_id)
            if not service:
                return {"message": "Service not found"}, 404
            return service
        else:
            services = Service.query.all()
            if not services:
                return {"message": "No services found"}, 404
            return services
        
    @auth_required('token')
    def delete(self, service_id):
        service = Service.query.get(service_id)
        if not service:
            return {"message": "Service not found"}, 404
        try:
            if current_user.is_admin:  # Assumes `is_admin` is a property of the user
                db.session.delete(service)
                db.session.commit()
                return {"message": "Service deleted"}, 200
            else:
                return {"message": "Unauthorized"}, 403
        except Exception as e:
            return {"message": "Service already in use"}, 500


    @auth_required('token')
    def post(self):
        if not current_user.is_admin:
            return {"message": "Unauthorized"}, 403

        data = request.form
        name = data.get('name')
        base_price = data.get('base_price')
        time_required = data.get('time_required')
        description = data.get('description')
        image = request.files.get('image')
        file_name = None
        if image:
            file_name = secure_filename(image.filename)
            image.save(os.path.join('source/images', secure_filename(image.filename)))
        service = Service(name=name, base_price=base_price, time_required=time_required, description=description, image=file_name)
        db.session.add(service)
        db.session.commit()
        return {'message': 'Service created'}, 201
    
    @auth_required('token')
    def put(self, service_id):
        if not current_user.is_admin:
            return {"message": "Unauthorized"}, 403

        service = Service.query.get(service_id)
        if not service:
            return {"message": "Service not found"}, 404

        data = request.form
        name = data.get('name', service.name)
        base_price = data.get('base_price', service.base_price)
        time_required = data.get('time_required', service.time_required)
        description = data.get('description', service.description)
        image = request.files.get('image')

        service.name = name
        service.base_price = base_price
        service.time_required = time_required
        service.description = description

        if image:
            if service.image:
                old_image_path = os.path.join('source/images', service.image)
                try:
                    os.remove(old_image_path)
                except:
                    pass

            file_name = secure_filename(image.filename)
            image.save(os.path.join('source/images', file_name))
            service.image = file_name

        try:
            db.session.commit()
            return {"message": "Service updated successfully", "service": service.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"An error occurred: {str(e)}"}, 500







class ServiceRequestAPI(Resource):
    @auth_required('token')
    @cache.memoize(timeout=5)
    @marshal_with(service_request_fields)
    def get(self, request_id):
        service_request = ServiceRequest.query.get(request_id)
        if not service_request:
            return {"message": "Service request not found"}, 404
        return service_request

    @auth_required('token')
    def delete(self, request_id):
        service_request = ServiceRequest.query.get(request_id)
        if not service_request:
            return {"message": "Service request not found"}, 404

        # Only the customer who created the request or admin can delete
        if service_request.customer_id == current_user.id or current_user.is_admin:
            db.session.delete(service_request)
            db.session.commit()
            return {"message": "Service request deleted"}, 200
        else:
            return {"message": "Unauthorized"}, 403



    @auth_required('token')
    def post(self):
        data = request.get_json()
        service_id = data.get('service_id')
        customer_id = current_user.id

        if not service_id:
            return {"message": "Service ID is required"}, 400

        service_request = ServiceRequest(
            service_id=service_id,
            customer_id=customer_id
        )
        db.session.add(service_request)
        db.session.commit()
        try:
            notify_professional(service_request.id)
        except ValueError as e:
            return {"message": str(e)}, 400
        return {"message": "Service request created"}, 201

    @auth_required('token')
    def put(self, request_id):
        service_request = ServiceRequest.query.get(request_id)
        if not service_request:
            return {"message": "Service request not found"}, 404

        if service_request.customer_id != current_user.id and not current_user.is_admin:
            return {"message": "Unauthorized"}, 403

        data = request.get_json()
        service_request.professional_id = data.get('professional_id', service_request.professional_id)
        service_request.date_of_completion = data.get('date_of_completion', service_request.date_of_completion)
        service_request.service_status = data.get('service_status', service_request.service_status)
        service_request.remarks = data.get('remarks', service_request.remarks)
        service_request.rating = data.get('rating', service_request.rating)

        db.session.commit()
        return {"message": "Service request updated"}, 200




def notify_professional(service_req_id):
    service_request = ServiceRequest.query.get(service_req_id)
    if not service_request:
        raise ValueError("Service request not found")

    service_name = service_request.service.name
    professionals = User.query.filter_by(service_type=service_name).all()
    if not professionals:
        raise ValueError("No professionals available for this service")

    free_professionals = [prof for prof in professionals if not prof.status == "Busy" and prof.active]
    if not free_professionals:
        raise ValueError("No free professionals available for this service")

    for prof in free_professionals:
        new_request = ServiceRequestRecord(
            service_request_id=service_req_id,
            professional_id=prof.id,
            status="Pending"
        )
        db.session.add(new_request)
    db.session.commit()



class ServiceRequestRecordAPI(Resource):
    @auth_required('token')
    def get(self):
        professional_id = current_user.id
        records = ServiceRequestRecord.query.filter_by(professional_id=professional_id).all()
        response_data = [
            {
                "id": record.id,
                "service_name": record.service_request.service.name,
                "customer_name": record.service_request.customer.name,
                "date_of_request": record.date_of_request,
                "status": record.status
            }
            for record in records
        ] 
        return jsonify(response_data)

api.add_resource(ServiceRequestRecordAPI, '/service_request_records')

class ServiceRequestListAPI(Resource): 
    @auth_required('token')
    @cache.cached(timeout=5, key_prefix='service_requests_list')
    @marshal_with(service_request_fields)
    def get(self):
        # Customers see their own requests; Admins see all
        if current_user.is_admin:
            requests = ServiceRequest.query.all()
        else:
            requests = ServiceRequest.query.filter_by(customer_id=current_user.id).all()
        return requests

    @auth_required('token')
    def post(self):
        data = request.get_json()
        service_id = data.get('service_id')
        remarks = data.get('remarks')
        rating = data.get('rating')


        service_request = ServiceRequest(
            service_id=service_id,
            customer_id=current_user.id,
            date_of_request=datetime.now(),
            remarks=remarks,
            rating = rating

        )
        db.session.add(service_request)
        db.session.commit()

        return {'message': 'Service request created'}, 201

class BasicFrontendRequirements(Resource):
    def get(self):
        sevices = Service.query.all()
        services_name = []
        for service in sevices:
            services_name.append(service.name)
        return jsonify(services_name)


class GetAllReviewsAndRating(Resource):
    def get(self, service_id):
        # Query to get the customer name, rating, and remarks for the given service_id
        reviews = db.session.query(
        User.id,
        User.name.label("name"),  # Fetch customer's name
        ServiceRequest.rating,
        ServiceRequest.remarks).join(User, User.id == ServiceRequest.customer_id).filter(ServiceRequest.service_id == service_id, ServiceRequest.rating.isnot(None)).all()
        # Prepare the response data
        response_data = [
            {
                "name": review.name,
                "rating": review.rating,
                "remark": review.remarks
            }
            for review in reviews
        ]

        return jsonify(response_data)

 
class GetAllUser(Resource):
    @auth_required('token')
    @marshal_with(user_fields)
    def get(self):
        users = User.query.all()
        return [user for user in users if get_user_role(user) is not None]

class BlockUser(Resource):
    @auth_required('token')
    def put(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        if not current_user.is_admin:
            return {"message": "Unauthorized"}, 403

        user.active = False
        user.status = "Blocked"
        db.session.commit()
        return {"message": "User blocked"}, 200

class UnBlockUser(Resource):
    @auth_required('token')
    def put(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        if not current_user.is_admin:
            return {"message": "Unauthorized"}, 403

        user.active = True
        user.status = "Active"
        db.session.commit()
        return {"message": "User Unblocked"}, 200
    


    
# Register resources with endpoints
api.add_resource(GetAllUser, '/users')
api.add_resource(GetAllReviewsAndRating, '/reviews/<int:service_id>')
api.add_resource(BasicFrontendRequirements, '/services_name')
api.add_resource(BlockUser, '/block_user/<int:user_id>')
api.add_resource(UnBlockUser, '/unblock_user/<int:user_id>')

# Register resources with endpoints
api.add_resource(ServiceAPI, '/services/<int:service_id>', '/services')  # `/services` added for POST
api.add_resource(ServiceRequestAPI, '/service_requests/<int:request_id>','/service_requests')
api.add_resource(ServiceRequestListAPI, '/service_requests123')




