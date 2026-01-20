// components/Button.tsx
import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle 
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'disabled';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  loading, 
  variant = 'primary', 
  icon,
  style,
  disabled,
  ...props 
}) => {
  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: disabled ? '#9ca3af' : '#3b82f6' };
      case 'secondary':
        return { backgroundColor: disabled ? '#9ca3af' : '#e5e7eb' };
      case 'disabled':
        return { backgroundColor: '#9ca3af' };
      default:
        return { backgroundColor: '#3b82f6' };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return { color: 'white' };
      case 'secondary':
        return { color: '#374151' };
      case 'disabled':
        return { color: 'white' };
      default:
        return { color: 'white' };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style as ViewStyle]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.text, getTextStyle()]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;