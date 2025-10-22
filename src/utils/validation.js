export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateInput = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (email && !validateEmail(email)) {
    errors.push('Format email tidak valid');
  }

  if (password && !validatePassword(password)) {
    errors.push('Password minimal 8 karakter, mengandung huruf dan angka');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors
    });
  }

  next();
};
