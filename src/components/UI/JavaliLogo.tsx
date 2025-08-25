import React from 'react';

interface JavaliLogoProps {
  size?: number;
  className?: string;
  color?: string;
}

export const JavaliLogo: React.FC<JavaliLogoProps> = ({ 
  size = 32, 
  className = "", 
  color = "currentColor" 
}) => {
  return (
    <img 
      src="/javalipay/logo_javalipay.png"
      alt="JavaliPay Logo"
      width={size} 
      height={size} 
      className={`${className} object-contain`}
      style={{
        filter: color === 'white' ? 'brightness(0) invert(1)' : 
                color === '#00FF88' ? 'brightness(0) saturate(100%) invert(85%) sepia(28%) saturate(7066%) hue-rotate(95deg) brightness(110%) contrast(107%)' :
                'none'
      }}
    />
  );
};
