# filepath: c:\Users\gusta\Documents\Projects\picturesServerWithDocker\backend\init_db.py
from app import db, User

# Create all tables
db.create_all()

# Add test users
if not User.query.filter_by(username='username').first():
    test_user = User(username='username', password='password')  # Plain text password for testing
    db.session.add(test_user)
    db.session.commit()

print("Database initialized with test users.")