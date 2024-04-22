# import sys
# sys.path.append("..")

from flask import jsonify, Blueprint
from ..Models.usersModels import Addresses

address_bp = Blueprint("addresses", __name__)

@address_bp.route('/addresses', methods=["GET"])
def get_addresses():
    addresses = Addresses.query.all()
    json_addresses = list(map(lambda x: x.to_json(), addresses))
    return jsonify({"addresses": json_addresses})




