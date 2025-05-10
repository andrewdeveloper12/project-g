import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface BMIStatusCardProps {
  weight: string;
  height: string;
  color: string;
  status: string;
}

const BMIStatusCard: React.FC<BMIStatusCardProps> = ({ 
  weight, 
  height, 
  color, 
  status 
}) => {
  const { t } = useTranslation();
  
  const bmi = useMemo(() => {
    if (!weight || !height) return null;
    
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // convert cm to m
    
    if (weightNum <= 0 || heightNum <= 0) return null;
    
    return (weightNum / (heightNum * heightNum)).toFixed(1);
  }, [weight, height]);
  
  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return t('status.low');
    if (bmiValue < 25) return t('status.normal');
    if (bmiValue < 30) return t('status.elevated');
    return t('status.high');
  };
  
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'text-green-500';
      case 'red':
        return 'text-red-500';
      case 'blue':
        return 'text-blue-500';
      case 'purple':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold mb-2">{t('status.bmi')}</h3>
      <div className="text-center">
        <motion.span 
          className={`text-3xl font-bold ${getColorClasses()}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {bmi || '--'}
        </motion.span>
        <p className="text-sm mt-1">
          {bmi ? getBMICategory(parseFloat(bmi)) : status}
        </p>
      </div>
    </motion.div>
  );
};

export default BMIStatusCard;