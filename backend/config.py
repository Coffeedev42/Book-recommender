from itsdangerous import URLSafeSerializer

SECRET_KEY = "secret!123"
serializer = URLSafeSerializer(SECRET_KEY)