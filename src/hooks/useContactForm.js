/**
 * @file useContactForm hook for managing contact form state, validation, and submission via EmailJS.
 */

import { useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { validateContactForm } from '../utils/validation.js';

const EMAILJS_SERVICE_ID = 'service_8bhe4b1';
const EMAILJS_TEMPLATE_ID = 'template_m8vmsvw';
const EMAILJS_PUBLIC_KEY = 'Av4ISoON89ZdOLSbK';

/**
 * @typedef {'idle' | 'submitting' | 'success' | 'error'} FormStatus
 */

const initialFormData = {
  name: '',
  email: '',
  message: '',
};

/**
 * Custom hook that manages contact form state, validation, and submission.
 */
export function useContactForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setStatus('idle');
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateContactForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return 'validation_error';
    }

    setErrors({});
    setStatus('submitting');

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      console.log('EmailJS Success:', result);
      setStatus('success');
      return 'success';
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error');
      return 'error';
    }
  }, [formData]);

  return {
    formData,
    errors,
    status,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
