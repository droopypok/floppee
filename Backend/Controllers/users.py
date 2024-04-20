import sys
sys.path.append("..")

from flask import jsonify
from Backend.config import app, db
from Backend.Models.usersModels import Users

@app.route('/users', methods=["GET"])
def get_users():
    users = Users.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    return jsonify({"users": json_users})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)

