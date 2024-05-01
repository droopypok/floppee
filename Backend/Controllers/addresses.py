from flask import jsonify, Blueprint, request
from ..Models.usersModels import Addresses, User_Address, Users
from ..extensions import db
from flask_cors import cross_origin

address_bp = Blueprint("addresses", __name__)

@address_bp.route('/addresses', methods=["GET", "OPTIONS"])
@cross_origin()
def get_all_addresses():
    addresses = Addresses.query.all()
    json_addresses = list(map(lambda x: x.to_json(), addresses))
    return jsonify({"addresses": json_addresses})


@address_bp.route('/addresses/<username>',methods=["POST", "OPTIONS"])
@cross_origin()
def get_user_addresses():
    username = request.json["username"]
    user = Users.query.filter_by(username=username).first() #get user details

    if user:

        user_addresses = Addresses.query.join(User_Address).filter(User_Address.user_id == user.id).all() #get all addresses linked to user
        json_addresses = list(map(lambda x: x.to_json(), user_addresses))  #map address if multiple

        return jsonify({"addresses": json_addresses})
    
    else:
        return jsonify({"error": "NO address found"}), 400


@address_bp.route('/create_address', methods=["POST", "OPTIONS"])
@cross_origin()
def create_address():
    data = request.json

    # Check if all required fields are present
    required_fields = ['address', 'postal_code', 'unit_number']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    #get user data
    username = data.get('username')
    user = Users.query.filter_by(username=username).first()

    # Create new address in addresses table
    new_address = Addresses(
        address=data['address'],
        postal_code=data['postal_code'],
        unit_number=data['unit_number']
    )

    db.session.add(new_address)
    db.session.commit()

    # Create new entry in constraint table
    user_address = User_Address(user_id=user.id, address_id=new_address.id)
    db.session.add(user_address)
    db.session.commit()

    return jsonify({"message": "Address created successfully"}), 201


@address_bp.route('/update_address/<int:id>', methods=["PATCH", "OPTIONS"])
@cross_origin()
def update_address(id): 
    data = request.json

    address = Addresses.query.get(id)

    if address is None:
        return jsonify({"error": "Error updaing address"}), 400

    # Update the address fields if they are present in the request
    if 'address' in data:
        address.address = data['address']
    if 'postal_code' in data:
        address.postal_code = data['postal_code']
    if 'unit_number' in data:
        address.unit_number = data['unit_number']

    db.session.commit()

    return jsonify({"message": "Address updated! :) "}), 200



@address_bp.route('/delete_address/<int:id>', methods=["DELETE", "OPTIONS"])
@cross_origin()
def delete_address(id): 
    address = Addresses.query.get(id)

    if address is None:
        return jsonify({"error": "Address not found"}), 400

    # Delete the address
    db.session.delete(address)
    db.session.commit()

    return jsonify({"message": "Address deleted successfully"}), 200