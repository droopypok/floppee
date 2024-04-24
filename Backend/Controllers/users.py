from flask import jsonify, request, Blueprint
from ..extensions import db
from ..Models.usersModels import Users, User_Roles
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_cors import cross_origin


bcrypt = Bcrypt()

users_bp = Blueprint("users", __name__)

@users_bp.route("/users/", methods=["GET"])
def get_users():
    print("here")
    users = Users.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    
    return jsonify({"users": json_users})


@users_bp.route("/login/", methods=['POST', 'OPTIONS'])
@cross_origin()
def login():

    username = request.json["username"]
    password = request.json["password"]

    print(request.json)

    user = Users.query.filter_by(username=username).first()
    
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Username or password not found!"}, 400)
    
    role = User_Roles.query.filter_by(id=user.role).first()

    # access = create_access_token(identity=user.username, additional_claims={'role': role})
    # refresh = create_refresh_token(identity=user.username, additional_claims={'role': role})
    access = create_access_token(identity=user.username, additional_claims={"role": role.role})
    refresh = create_refresh_token(identity=user.username, additional_claims={"role": role.role})

    return jsonify({"id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "access": access,
                    "refresh": refresh,})

   


@users_bp.route("/register/", methods=["POST", "OPTIONS"])
@cross_origin()
def register():
    username = request.json["username"]
    password = request.json["password"]
    role_name = request.json["role"]

    print(request.json)

    user_exists = Users.query.filter_by(username=username).first() is not None

    if user_exists:
        return jsonify({"message": "Unable to create account"}, 400)
    
    role = User_Roles.query.filter_by(role=role_name).first()
    if not role:
        return jsonify({"error": "Role not found"}), 404
    
    hashed_password = bcrypt.generate_password_hash(password, 10).decode('utf-8')
    new_user = Users(username=username, password=hashed_password, role=role.id)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "role": new_user.role
    })


@users_bp.route("/roles/", methods=["GET", "OPTIONS"])
@cross_origin()
def get_roles():
    roles = User_Roles.query.all()
    json_roles = list(map(lambda x: x.to_json(), roles))

    return jsonify({"roles": json_roles})