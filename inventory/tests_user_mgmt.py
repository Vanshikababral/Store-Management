from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class UserMgmtTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.list_url = reverse('user-list')
        
        # Create an admin user
        self.admin_user = User.objects.create_superuser(username='admin_test', email='adm@test.com', password='adminpassword')
        
        # Create a regular staff user
        self.staff_user = User.objects.create_user(username='staff_test', email='staff@test.com', password='staffpassword')
        self.staff_user.is_staff = True
        self.staff_user.is_active = False
        self.staff_user.save()
        
        self.detail_url = reverse('user-detail', kwargs={'pk': self.staff_user.id})

    def test_list_users_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should see staff_test but NOT themselves
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'staff_test')

    def test_approve_user_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(self.detail_url, {'is_active': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.staff_user.refresh_from_db()
        self.assertTrue(self.staff_user.is_active)

    def test_delete_user_as_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=self.staff_user.id).exists())

    def test_access_denied_for_staff(self):
        # Staff user who is active should still be denied access to manage others
        self.staff_user.is_active = True
        self.staff_user.save()
        
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
