from ..Models.usersModels import Products, Product_Item, Product_Type_Selections, Product_Types, Categories
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db

## Products Table

products_bp = Blueprint("/products/", __name__)

@products_bp.route('/products/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_all_products():
    products = Products.query.all()
    json_products = list(map(lambda x: x.to_json(), products))
    return jsonify({"products": json_products})


@products_bp.route('/products/<int:id>/', methods=["POST", "OPTIONS"])
@cross_origin()
def get_product(id):
    product = Products.query.get(id)

    if product:
        return jsonify({"product": product})
    
    else:
        return jsonify({"error": "NO product found"}), 400


@products_bp.route('/create_product/', methods=["POST", "OPTIONS"])
@cross_origin()
def create_product():
    data = request.json

    # Check if all required fields are present
    required_fields = ['description', 'name', 'category']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    

    description = data['description']
    name = data['name']
    category_name = data['category']

    category = Categories.query.filter_by(category_name=category_name).first()

    new_product = Products(description=description, name=name, category=category.id)

    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Product created successfully"}), 200


@products_bp.route('/update_product/<int:id>/', methods=["PUT", "OPTIONS"])
@cross_origin()
def update_product(id):
    data = request.json

    # Retrieve the product from the database
    product = Products.query.get(id)

    if product is None:
        return jsonify({"error": "Product not found"}), 404

    # Update the product fields if they are present in the request
    if 'description' in data:
        product.description = data['description']
    if 'name' in data:
        product.name = data['name']
    if 'category' in data:
        category_name = data['category']
        category = Categories.query.filter_by(category_name=category_name).first()
        product.category_id = category.id

  
        db.session.commit()
    
        return jsonify({"message": "Product updated successfully"}), 200



@products_bp.route('/delete_product/<int:id>', methods=["DELETE", "OPTIONS"])
@cross_origin()
def delete_product(id): 
    product = Products.query.get(id)

    if product is None:
        return jsonify({"error": "Product not found"}), 400

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted successfully"}), 200



## Categories
@products_bp.route('/categories/', methods=["GET", "OPTIONS"])
@cross_origin()
def get_all_categories():
    categories = Categories.query.all()
    json_categories = list(map(lambda category: category.to_json(), categories))
    return jsonify({"categories": json_categories})


## Get ALL products from Categories

@products_bp.route('/categories/<int:id>/', methods=["POST", "OPTIONS"])
@cross_origin()
def get_products_by_category(id):
    category = Categories.query.get(id)

    if category is None:
        return jsonify({"error": "Category not found"}), 404

    products = Products.query.filter_by(category=id).all()
    json_products = list(map(lambda product: product.to_json(), products))

    return jsonify({"products": json_products})