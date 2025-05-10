import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip,
  Legend 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip,
  Legend
);

interface HealthTrendsSectionProps {
  conditionId: string;
  chartData?: {
    monthly: number[];
    weekly: number[];
  };
  showCharts: boolean;
}

const HealthTrendsSection: React.FC<HealthTrendsSectionProps> = ({ 
  conditionId,
  chartData,
  showCharts
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const lineChartRef = useRef<ChartJS>(null);
  const barChartRef = useRef<ChartJS>(null);
  
  const [animateCharts, setAnimateCharts] = useState(false);
  
  // Generate realistic data based on condition
  const generateMonthlyData = () => {
    let baseValue = 0;
    let variation = 0;
    
    switch (conditionId) {
      case 'diabetes':
        baseValue = 120;
        variation = 60;
        break;
      case 'heart':
        baseValue = 150;
        variation = 50;
        break;
      case 'pressure':
        baseValue = 120;
        variation = 20;
        break;
      case 'anemia':
        baseValue = 13;
        variation = 2;
        break;
      default:
        baseValue = 100;
        variation = 30;
    }
    
    // Generate realistic trend with some randomness
    return Array.from({ length: 30 }, (_, i) => {
      const trend = Math.sin(i / 5) * (variation / 2); // Sinusoidal pattern
      const random = Math.random() * (variation / 2) - (variation / 4); // Random noise
      return baseValue + trend + random;
    });
  };

  // More realistic daily data
  const generateWeeklyData = () => {
    let baseValue = 0;
    
    switch (conditionId) {
      case 'diabetes':
        baseValue = 1.5;
        break;
      case 'heart':
        baseValue = 2.0;
        break;
      case 'pressure':
        baseValue = 1.75;
        break;
      case 'anemia':
        baseValue = 1.25;
        break;
      default:
        baseValue = 1.5;
    }
    
    return [
      baseValue + 0.75, // Monday
      baseValue, // Tuesday
      baseValue + 1, // Wednesday
      baseValue + 0.25, // Thursday
      baseValue + 0.25, // Friday
      baseValue, // Saturday
      baseValue + 0.75, // Sunday
    ];
  };
  
  // Set animation after mount
  useEffect(() => {
    if (showCharts) {
      const timer = setTimeout(() => {
        setAnimateCharts(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setAnimateCharts(false);
    }
  }, [showCharts]);
  
  // Cleanup charts on unmount
  useEffect(() => {
    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
    };
  }, []);

  // Generate days of the week in the correct language
  const getDaysOfWeek = () => {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return days.map(day => t(`days.${day}`));
  };

  const monthlyData = {
    labels: Array.from({ length: 30 }, (_, i) => (i + 1).toString()),
    datasets: [{
      data: chartData?.monthly || generateMonthlyData(),
      borderColor: getConditionColor(conditionId),
      backgroundColor: `${getConditionColor(conditionId)}26`, // Add 26 for 15% opacity
      fill: true,
      tension: 0.4,
    }]
  };

  const weeklyData = {
    labels: getDaysOfWeek(),
    datasets: [{
      data: chartData?.weekly || generateWeeklyData(),
      backgroundColor: getConditionColor(conditionId),
      borderRadius: 8,
    }]
  };

  // Get color based on condition ID
  function getConditionColor(condition: string): string {
    switch (condition) {
      case 'diabetes':
        return '#10B981'; // Green
      case 'heart':
        return '#EF4444'; // Red
      case 'pressure':
        return '#3B82F6'; // Blue
      case 'anemia':
        return '#8B5CF6'; // Purple
      default:
        return '#4F46E5'; // Default indigo
    }
  }

  if (!showCharts) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">{t('healthTrends')}</h3>
        <div className="flex justify-center items-center bg-white rounded-xl shadow p-8 h-64">
          <motion.p 
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t('status.enterData')}
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">{t('healthTrends')}</h3>
      <AnimatePresence>
        {showCharts && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow p-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-md font-medium mb-4">{t('monthlyTrend')}</h4>
              <div className="h-64">
                <Line 
                  data={monthlyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { display: true },
                      y: { 
                        display: true,
                        min: 40,
                        max: 450,
                        ticks: {
                          stepSize: 50
                        }
                      }
                    },
                    animation: {
                      duration: animateCharts ? 1500 : 0
                    }
                  }}
                  id={`line-chart-${conditionId}`}
                />
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl shadow p-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-md font-medium mb-4">{t('weeklyActivity')}</h4>
              <div className="h-64">
                <Bar 
                  data={weeklyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false } },
                      y: { 
                        grid: { display: false },
                        ticks: {
                          stepSize: 0.5
                        }
                      }
                    },
                    animation: {
                      duration: animateCharts ? 1500 : 0
                    }
                  }}
                  id={`bar-chart-${conditionId}`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthTrendsSection;