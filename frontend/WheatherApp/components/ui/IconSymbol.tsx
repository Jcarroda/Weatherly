import React from 'react';
import { Text, type TextProps, type StyleProp, type TextStyle } from 'react-native';

interface IconSymbolProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function IconSymbol({ name, size = 24, color = '#000', style, ...props }: IconSymbolProps) {
  return (
    <Text style={[{ fontSize: size, color }, style]} {...props}>
      {name}
    </Text>
  );
}
