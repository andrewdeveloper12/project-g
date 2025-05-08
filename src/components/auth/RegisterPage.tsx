// src/pages/Register.tsx

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useUser } from '../Context/UserContext.context';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
}

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  name: keyof FormData;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken } = useUser();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showOTP, setShowOTP] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setAuthError('');
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!formData.name.trim()) newErrors.name = t('register.errors.nameRequired');
    if (!formData.email.trim()) newErrors.email = t('register.errors.emailRequired');
    if (!formData.password) {
      newErrors.password = t('register.errors.passwordRequired');
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password = t('register.errors.passwordInvalid') || 'Invalid password.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.passwordsDontMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://carelens.up.railway.app/api/auth/signup',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        setShowOTP(true);
      }
    } catch (err: any) {
      setAuthError(
        err.response?.data?.err ||
        err.response?.data?.message ||
        'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://carelens.up.railway.app/api/auth/verifyEmail',
        {
          email: formData.email,
          otp: formData.otp,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { token } = response.data;

      if (token) {
        localStorage.setItem('userToken', token);
        setToken(token);
        navigate('/');
      } else {
        setAuthError('Token not returned by server.');
      }
    } catch (err: any) {
      setAuthError(
        err.response?.data?.err ||
        err.response?.data?.message ||
        'OTP verification failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!showOTP && !validate()) return;
    if (!showOTP) {
      await handleSignup();
    } else {
      await handleVerify();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <div className="w-full max-w-md p-14 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{t('register.title')}</h1>
          <p className="text-sm text-gray-600">
            {t('register.subtitle')}{' '}
            <Link
              to="/login"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              {t('register.signIn')}
            </Link>
          </p>
        </div>

        {authError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!showOTP ? (
            <>
              <InputField icon={<User />} label={t('register.name')} name="name" value={formData.name} onChange={handleChange} error={errors.name} />
              <InputField icon={<Mail />} label={t('register.email')} name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
              <InputField icon={<Lock />} label={t('register.password')} name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
              <InputField icon={<Lock />} label={t('register.confirmPassword')} name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
            </>
          ) : (
            <InputField icon={<KeyRound />} label={t('register.otp')} name="otp" value={formData.otp} onChange={handleChange} error={errors.otp} placeholder="Enter OTP" />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {showOTP ? t('register.verifying') : t('register.creatingAccount')}
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4" />
                {showOTP ? t('register.verifyAccount') : t('register.createAccount')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField: React.FC<InputFieldProps> = ({
  icon,
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required
        className={`block w-full pl-10 pr-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
      />
    </div>
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

export default Register;
