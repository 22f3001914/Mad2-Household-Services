from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
db = SQLAlchemy()
from datetime import datetime

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    # flask-security-specific
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, default=True)
    roles = db.Relationship("Role", backref='bearers', secondary='user_roles')

    # Fields for Service Professionals
    name = db.Column(db.String(100))
    date_created = db.Column(db.DateTime, default=datetime.now())
    description = db.Column(db.String(255))
    service_type = db.Column(db.String(100))  # Type of service provided (e.g., AC Servicing)
    experience = db.Column(db.Integer)
    location = db.Column(db.String(100))  # Customer's pin code area for location-based search
    image = db.Column(db.String(255))  # Location of the image
    resume = db.Column(db.String(255))  # Location of the resume
    status = db.Column(db.String(20), default="Active")  # Options: active, inactive

    def is_admin(self):
        return self.roles and any(role.name == 'admin' for role in self.roles)

    def is_service_professional(self):
        return any(role.name == 'professional' for role in self.roles)

    def is_customer(self):
        return any(role.name == 'user' for role in self.roles)
    
    @property
    def rating(self):
        service_requests = ServiceRequest.query.filter_by(professional_id=self.id).all()
        total_ratings = sum(req.rating for req in service_requests if req.rating is not None)
        num_ratings = sum(1 for req in service_requests if req.rating is not None)
        return total_ratings / num_ratings if num_ratings > 0 else 0.0
        

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable = False)
    description = db.Column(db.String, nullable = False)

class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))


class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    base_price = db.Column(db.Float, nullable=False)  # Set by Admin
    time_required = db.Column(db.String(50))  # Approximate time required for the service
    description = db.Column(db.String(255))
    date_created = db.Column(db.DateTime, default=datetime.now())
    image = db.Column(db.String(255))  # Location of the image

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "base_price": self.base_price,
            "time_required": self.time_required,
            "description": self.description,
            "image": self.image,
        }
    
    @property
    def average_rating(self):
        service_requests = ServiceRequest.query.filter_by(service_id=self.id).all()
        total_ratings = sum(req.rating for req in service_requests if req.rating is not None)
        num_ratings = sum(1 for req in service_requests if req.rating is not None)
        return total_ratings / num_ratings if num_ratings > 0 else 0.0
    @property
    def num_ratings(self):
        return sum(1 for req in self.requests if req.rating is not None)
    
    @property
    def num_requests(self):
        return len(self.requests)
    
    @property
    def mrp(self):
        return self.base_price * 1.18
    

# ServiceRequest model for tracking requests from customers to service professionals
class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    
    date_of_request = db.Column(db.DateTime, default=datetime.now())
    date_of_completion = db.Column(db.DateTime)
    service_status = db.Column(db.String(20), default="requested")  # Options: requested, assigned, closed
    remarks = db.Column(db.String(255))  # Remarks from customer or professional
    rating = db.Column(db.Integer)  # Rating given by the customer

    # Relationships
    service = db.relationship("Service", backref="requests")
    customer = db.relationship("User", foreign_keys=[customer_id], backref="customer_requests")
    professional = db.relationship("User", foreign_keys=[professional_id], backref="assigned_services")



class ServiceRequestRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service_request_id = db.Column(db.Integer, db.ForeignKey('service_request.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default="requested")  # Options: requested, assigned
    # Relationships
    date_of_request = db.Column(db.DateTime, default=datetime.now())
    service_request = db.relationship("ServiceRequest", backref="records")
    professional = db.relationship("User", backref="service_records")
