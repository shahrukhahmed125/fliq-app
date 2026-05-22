import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/useAuth';
import { authService } from '../../../services/authService';
import { ROUTES } from '../../../lib/constants';

function SignUpPage() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      setGeneralError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setGeneralError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      const response: any = await authService.register(formData);
      
      // Store token and user data
      const user = response.data?.user || response.data;
      const token = response.token;
      
      login(user, token);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
      
      (navigation as any).navigate(ROUTES.HOME);
      
    } catch (error: any) {
      console.log('REGISTER ERROR:', error.response?.data || error);
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        let formattedErrors: any = {};
        
        Object.keys(validationErrors).forEach((key) => {
          formattedErrors[key] = validationErrors[key][0];
        });
        
        setErrors(formattedErrors);
      } else {
        setGeneralError(
          error.response?.data?.message || 'Unable to sign up. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.branding}>
            <Text style={styles.brandName}>Fliq</Text>
            <Text style={styles.tagline}>Join Fliq</Text>
            <Text style={styles.description}>
              Create your account to start sharing and connecting.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Name"
                placeholderTextColor="#999"
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                autoCapitalize="words"
                autoComplete="name"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, errors.password_confirmation && styles.inputError]}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={formData.password_confirmation}
                onChangeText={(text) => handleChange('password_confirmation', text)}
                secureTextEntry
                autoCapitalize="none"
              />
              {errors.password_confirmation && <Text style={styles.errorText}>{errors.password_confirmation}</Text>}
            </View>

            {generalError ? (
              <Text style={styles.generalError}>{generalError}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating account...' : 'Sign up'}
              </Text>
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => (navigation as any).navigate(ROUTES.SIGN_IN)}
              >
                <Text style={styles.linkText}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  branding: {
    marginBottom: 48,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#111',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 8,
    marginLeft: 12,
  },
  generalError: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: '#666',
    fontSize: 14,
  },
});

export default SignUpPage;
