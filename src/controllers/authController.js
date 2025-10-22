import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res, next) => {
    try {
        const {
            email,
            password,
            role
        } = req.body;

        // Cek apakah user sudah ada
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat user baru
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        // Generate JWT token
        const token = jwt.sign({
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            },
            process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    role: newUser.role
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Cari user berdasarkan email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        // Generate JWT token
        const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    avatar_uri: user.avatar_uri
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};