import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { uploadToCloudinary } from '../middleware/upload.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, password } = req.body;
    
    // Pastikan user hanya bisa edit profilnya sendiri
    if (parseInt(req.params.id) !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah profil ini'
      });
    }

    let updateData = { email };

    // Upload avatar jika ada
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        updateData.avatar_uri = result.secure_url;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Gagal mengupload gambar',
          error: uploadError.message
        });
      }
    }

    // Update password jika ada
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.updatePassword(userId, hashedPassword);
    }

    // Update profil
    const updatedUser = await User.updateProfile(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (parseInt(req.params.id) !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses untuk mengubah profil ini'
      });
    }

    const updatedUser = await User.updateProfile(userId, { avatar_uri: null });

    res.status(200).json({
      success: true,
      message: 'Avatar berhasil dihapus',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
