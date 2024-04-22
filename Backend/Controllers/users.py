from flask import jsonify, request, Blueprint
from ..extensions import db
from ..Models.usersModels import Users
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token

bcrypt = Bcrypt()

users_bp = Blueprint("users", __name__)


@users_bp.route("/users", methods=["GET"])
def get_users():
    print("here")
    users = Users.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    
    return jsonify({"users": json_users})

@users_bp.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = Users.query.filter_by(username=username).first()
    
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Username or password not found!"}, 400)

    access = create_access_token(identity=user.username, additional_claims=user.role)
    refresh = create_refresh_token(identity=user.username, additional_claims=user.role)

    return jsonify({"id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "access": access,
                    "refresh": refresh,})


@users_bp.route("/register", methods=["POST"])
def register():
    username = request.json["username"]
    password = request.json["password"]
   
    
    user_exists = Users.query.filter_by(username=username).first() is not None

    if user_exists:
        return jsonify({"message": "Unable to create account"}, 400)
      

    
    hashed_password = bcrypt.generate_password_hash(password, 10).decode('utf-8')
    new_user = Users(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
    })

