import sys
sys.path.append("..")

from flask import jsonify
from Backend.config import app, db
from Backend.Models.usersModels import Addresses

@app.route('/users', methods=["GET"])
def get_addresses():
    addresses = Addresses.query.all()
    json_addresses = list(map(lambda x: x.to_json(), addresses))
    return jsonify({"users": json_addresses})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)

