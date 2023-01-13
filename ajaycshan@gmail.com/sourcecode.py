import requests
import json
import pyotp
from flask import Flask, request, jsonify, redirect, session
from google.cloud import bigquery, iam
from google.oauth2 import id_token
from pyotp import TOTP

app = Flask(__name__)
bigquery_client = bigquery.Client()
iam_client = iam.Client()

# Global Variable
CLIENT_ID = 'CLIENT_ID'


# Verify user's identity with SSO authentication using GCP (Google Cloud Platform) token verification endpoint
def verify_identity(token):
    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
    except ValueError as e:
        # Invalid token
        return None
    # action_user_id used to distinguish between user_id of actioning user vs actioned user
    action_user_id = id_info['sub']
    return action_user_id



# MFA Authentication
def verify_mfa(token, mfa_code):
    try:
        totp = pyotp.TOTP(token)
        if not totp.verify(mfa_code):
            raise ValueError('Invalid MFA code.')
    except ValueError as e:
        # Invalid MFA
        return False
    return True



# CRUD of users

@app.route('/users', methods=['POST'])
def create_user():
    # Extract data, token and MFA code from request
    data = request.get_json()
    token = request.headers.get('Authorization')
    mfa_code = request.headers.get("X-MFA-Code")
    # Verify the user's identity and MFA code from request
    if not token or not mfa_code:
        return jsonify({'message': 'Unauthorized'}), 401
    # Extract user information from request
    action_user_id = verify_identity(token)
    # Verify token and MFA code for login
    if action_user_id is None or not verify_mfa(token, mfa_code):
        return jsonify({'message': 'Unauthorized'}), 401
    # Check if user has permission to create a user
    if not iam_client.test_permissions(action_user_id, 'bigquery.tables.insert'):
        return jsonify({'message': 'Forbidden'}), 403
    # Create a new user in the table
    table_ref = bigquery_client.dataset('cxnpl').table('users')
    table = bigquery_client.get_table(table_ref)
    rows_to_insert = [data]
    errors = bigquery_client.insert_rows(table, rows_to_insert)
    if not errors:
        return jsonify({'message': 'User created successfully'}), 201
    else:
        return jsonify({'message': 'An error occurred: {}'.format(errors)}), 500

@app.route('/users', methods=['GET'])
def get_users():
    # Extract token and MFA code from request
    token = request.headers.get('Authorization')
    mfa_code = request.headers.get("X-MFA-Code")
    # Verify the user's identity and MFA code from request
    if not token or not mfa_code:
        return jsonify({'message': 'Unauthorized'}), 401
    # Extract user information from request
    action_user_id = verify_identity(token)
    # Verify token and MFA code for login
    if action_user_id is None or not verify_mfa(token, mfa_code):
        return jsonify({'message': 'Unauthorized'}), 401
    # Check if user has permission to view users
    if not iam_client.test_permissions(action_user_id, 'bigquery.tables.get'):
        return jsonify({'message': 'Forbidden'}), 403
    # Execute the query to fetch all users
    query = bigquery_client.query("SELECT * FROM `cxnpl.users`")
    query_job = query.result()
    rows = query_job.to_dataframe()
    return jsonify(rows.to_dict()), 200

@app.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    # Extract data, token and MFA code from request
    data = request.get_json()
    token = request.headers.get('Authorization')
    mfa_code = request.headers.get("X-MFA-Code")
    # Verify the user's identity and MFA code from request
    if not token or not mfa_code:
        return jsonify({'message': 'Unauthorized'}), 401
    # Extract user information from request
    action_user_id = verify_identity(token)
    # Verify token and MFA code for login
    if action_user_id is None or not verify_mfa(token, mfa_code):
        return jsonify({'message': 'Unauthorized'}), 401
    # Check if user has permission to update a user
    if not iam_client.test_permissions(action_user_id, 'bigquery.tables.update'):
        return jsonify({'message': 'Forbidden'}), 403
    # Create a new query to update the user
    query = bigquery.Query(f"UPDATE cxnpl.users SET email = '{data['email']}' WHERE user_id = {user_id}")
    query_job = bigquery_client.query(query)
    query_job.result()
    return jsonify({'message': f'User with user_id {user_id} was updated successfully'}), 200

@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Extract token and MFA code from request
    token = request.headers.get('Authorization')
    mfa_code = request.headers.get("X-MFA-Code")
    # Verify the user's identity and MFA code from request
    if not token or not mfa_code:
        return jsonify({'message': 'Unauthorized'}), 401
    # Extract user information from request
    action_user_id = verify_identity(token)
    # Verify token and MFA code for login
    if action_user_id is None or not verify_mfa(token, mfa_code):
        return jsonify({'message': 'Unauthorized'}), 401
    # Check if user has permission to create a user
    if not iam_client.test_permissions(action_user_id, 'bigquery.tables.delete'):
        return jsonify({'message': 'Forbidden'}), 403
    # Create a new query to delete the user
    query = bigquery.Query(f"DELETE FROM cxnpl.users WHERE user_id = {user_id}")
    query_job = bigquery_client.query(query)
    query_job.result()
    return jsonify({'message': f'User with user_id {user_id} was deleted successfully'}), 200



# CRUD of permissions

@app.route('/permissions', methods=['POST'])
def create_permission():
    # Extract data, token and MFA code from request
    data = request.get_json()
    token = request.headers.get('Authorization')
    mfa_code = request.headers.get("X-MFA-Code")
    # Verify the user's identity and MFA code from request
    if not token or not mfa_code:
        return jsonify({'message': 'Unauthorized'}), 401
    # Extract user information from request
    action_user_id = verify_identity(token)
    # Verify token and MFA code for login
    if action_user_id is None or not verify_mfa(token, mfa_code):
        return jsonify({'message': 'Unauthorized'}), 401
    # Check if user has permission to create permissions
    if not iam_client.test_permissions(action_user_id, 'bigquery.tables.insert'):
        return jsonify({'message': 'Forbidden'}), 403
    # Insert permission into the permissions table
    table_ref = bigquery_client.dataset('cxnpl').table('permissions')
    table = bigquery_client.get_table(table_ref)
    rows_to_insert = [data]
    errors = bigquery_client.insert_rows(table, rows_to_insert)
    if not errors:
        return jsonify({'message': 'Permission created successfully'}), 201
    else:
        return jsonify({'message': 'An error occurred: {}'.format(errors)}), 500

@app.route('/permissions', methods=['GET'])
def get_permissions():
    # Extract token and MFA code from request
    token = request.headers.get('Authorization')
    mfa_code = request.headers.get("X-MFA-Code")
    # Verify the user's identity and MFA code from request
    if not token or not mfa_code:
        return jsonify({'message': 'Unauthorized'}), 401
    # Extract user information from request
    action_user_id = verify_identity(token)
    # Verify token and MFA code for login
    if action_user_id is None or not verify_mfa(token, mfa_code):
        return jsonify({'message': 'Unauthorized'}), 401
    # Check if user has permission to read permissions
    if not iam_client.test_permissions(action_user_id, 'bigquery.tables.get'):
        return jsonify({'message': 'Forbidden'}), 403
    # Execute the query to retrieve permissions
    query = bigquery_client.query("SELECT * FROM cxnpl.permissions")
    query_job = query.result()
    rows = query_job.to_dataframe()
    return jsonify(rows.to_dict()), 200

@app.route('/permissions/<user_id>', methods=['PUT'])
def update_permission(user_id):
    # Extract data, token and MFA code from request
    data = request.get_json()
    token = request.headers.get('Authorization')
    mfa_code = request.headers.get("X-MFA-Code")
    # Verify the user's identity and MFA code from request
    if not token or not mfa_code:
        return jsonify({'message': 'Unauthorized'}), 401
    # Extract user information from request
    action_user_id = verify_identity(token)
    # Verify token and MFA code for login
    if action_user_id is None or not verify_mfa(token, mfa_code):
        return jsonify({'message': 'Unauthorized'}), 401
    # Check if user has permission to update permissions
    if not iam_client.test_permissions(action_user_id, 'bigquery.tables.update'):
        return jsonify({'message': 'Forbidden'}), 403
    # Update the permission with given user_id
    table_ref = bigquery_client.dataset('cxnpl').table('permissions')
    table = bigquery_client.get_table(table_ref)
    rows_to_update = [
        bigquery.Row(user_id=user_id, **data)
    ]
    errors = bigquery_client.update_rows(table, rows_to_update)
    if not errors:
        return jsonify({'message': 'Permission updated successfully'}), 200
    else:
        return jsonify({'message': 'An error occurred: {}'.format(errors)}), 500

@app.route('/permissions/<user_id>', methods=['DELETE'])
def delete_permissions(user_id):
    # Extract token and MFA code from request
    token = request.headers.get('Authorization')
    mfa_code = request.headers.get("X-MFA-Code")
    # Verify the user's identity and MFA code from request
    if not token or not mfa_code:
        return jsonify({'message': 'Unauthorized'}), 401
    # Extract user information from request
    action_user_id = verify_identity(token)
    # Verify token and MFA code for login
    if action_user_id is None or not verify_mfa(token, mfa_code):
        return jsonify({'message': 'Unauthorized'}), 401
    # Check if user has permission to delete permissions
    if not iam_client.test_permissions(action_user_id, 'bigquery.tables.delete'):
        return jsonify({'message': 'Forbidden'}), 403
    # Delete the permission with given user_id
    table_ref = bigquery_client.dataset('cxnpl').table('permissions')
    table = bigquery_client.get_table(table_ref)
    rows_to_delete = [
        bigquery.Row(user_id=user_id)
    ]
    errors = bigquery_client.delete_rows(table, rows_to_delete)
    if not errors:
        return jsonify({'message': 'Permission deleted successfully'}), 200
    else:
        return jsonify({'message': 'An error occurred: {}'.format(errors)}), 500


if __name__ == '__main__':
    app.run(debug=True)




















