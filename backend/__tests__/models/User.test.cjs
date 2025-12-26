const User = require('../../models/User.cjs');
const mongoose = require('mongoose');

describe('User Model', () => {
  describe('Schema Validation', () => {
    it('should create a user with valid email and password', async () => {
      const userData = {
        email: 'valid@example.com',
        password: 'hashedpassword123',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).toBe(userData.password);
    });

    it('should fail without email', async () => {
      const user = new User({ password: 'password123' });
      
      let error;
      try {
        await user.save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    it('should fail without password', async () => {
      const user = new User({ email: 'test@example.com' });
      
      let error;
      try {
        await user.save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should enforce unique email', async () => {
      const userData = {
        email: 'unique@example.com',
        password: 'password123',
      };

      // Save first user
      await new User(userData).save();

      // Try to save duplicate
      let error;
      try {
        await new User(userData).save();
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    });
  });

  describe('User Operations', () => {
    it('should find user by email', async () => {
      const userData = {
        email: 'findme@example.com',
        password: 'password123',
      };

      await new User(userData).save();
      const foundUser = await User.findOne({ email: userData.email });

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe(userData.email);
    });

    it('should update user password', async () => {
      const user = await new User({
        email: 'update@example.com',
        password: 'oldpassword',
      }).save();

      user.password = 'newpassword';
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.password).toBe('newpassword');
    });

    it('should delete user', async () => {
      const user = await new User({
        email: 'delete@example.com',
        password: 'password123',
      }).save();

      await User.findByIdAndDelete(user._id);
      const deletedUser = await User.findById(user._id);

      expect(deletedUser).toBeNull();
    });
  });
});
