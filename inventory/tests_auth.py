from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth_register')
        self.login_url = reverse('token_obtain_pair')
        self.username = 'teststaff'
        self.email = 'teststaff@example.com'
        self.password = 'staffpassword123'

    def test_registration_and_login_flow(self):
        # 1. Register a new user
        response = self.client.post(self.register_url, {
            'username': self.username,
            'email': self.email,
            'password': self.password
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify user is created but inactive
        user = User.objects.get(username=self.username)
        self.assertFalse(user.is_active)
        self.assertTrue(user.is_staff)

        # 2. Try to login (should fail because inactive)
        response = self.client.post(self.login_url, {
            'username': self.username,
            'password': self.password
        })
        if response.status_code != status.HTTP_401_UNAUTHORIZED:
            print(f"DEBUG Login 1: {response.status_code} - {response.data}")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # 3. Simulate Admin Approval (activate user)
        user.is_active = True
        user.save()

        # 4. Try to login again (should succeed)
        response = self.client.post(self.login_url, {
            'username': self.username,
            'password': self.password
        })
        if response.status_code != status.HTTP_200_OK:
            print(f"DEBUG Login 2: {response.status_code} - {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertTrue(response.data['is_staff'])
