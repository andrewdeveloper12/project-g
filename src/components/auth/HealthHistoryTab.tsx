import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, Calendar, Filter, Clock } from 'lucide-react';

interface HealthRecord {
  id: string;
  date: string;
  metricType: string;
  value: string;
  unit: string;
  notes?: string;
}

// Generate realistic health records for the past year
const generateHealthRecords = (): HealthRecord[] => {
  const records: HealthRecord[] = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  // Blood Pressure - Every 2 weeks
  for (let i = 0; i < 26; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 14));
    const systolic = 115 + Math.floor(Math.random() * 10);
    const diastolic = 75 + Math.floor(Math.random() * 8);
    
    records.push({
      id: `bp-${i}`,
      date: date.toISOString().split('T')[0],
      metricType: 'bloodPressure',
      value: `${systolic}/${diastolic}`,
      unit: 'mmHg',
      notes: i % 2 === 0 ? 'Morning measurement' : 'Evening measurement'
    });
  }

  // Heart Rate - Weekly
  for (let i = 0; i < 52; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 7));
    const heartRate = 65 + Math.floor(Math.random() * 15);
    
    records.push({
      id: `hr-${i}`,
      date: date.toISOString().split('T')[0],
      metricType: 'heartRate',
      value: heartRate.toString(),
      unit: 'bpm',
      notes: i % 3 === 0 ? 'After exercise' : 'Resting'
    });
  }

  // Glucose - Every 3 days
  for (let i = 0; i < 122; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 3));
    const glucose = 85 + Math.floor(Math.random() * 20);
    
    records.push({
      id: `gl-${i}`,
      date: date.toISOString().split('T')[0],
      metricType: 'glucose',
      value: glucose.toString(),
      unit: 'mg/dL',
      notes: i % 2 === 0 ? 'Fasting' : 'Post-meal (2 hours)'
    });
  }

  // Weight - Every 5 days
  let currentWeight = 70;
  for (let i = 0; i < 73; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 5));
    // Slight weight fluctuation
    currentWeight += (Math.random() - 0.5) * 0.3;
    
    records.push({
      id: `wt-${i}`,
      date: date.toISOString().split('T')[0],
      metricType: 'weight',
      value: currentWeight.toFixed(1),
      unit: 'kg',
      notes: 'Morning weight'
    });
  }

  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const mockHealthRecords = generateHealthRecords();

const HealthHistoryTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [currentPage, setCurrentPage] = React.useState(1);
  const recordsPerPage = 10;

  const paginatedRecords = mockHealthRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalPages = Math.ceil(mockHealthRecords.length / recordsPerPage);

  return (
    <div className="space-y-6">
      <div className={`flex flex-col md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''} justify-between items-start md:items-center gap-4`}>
        <h2 className="text-xl font-semibold text-gray-800">{t('history.title')}</h2>
        
        <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter size={16} />
            <span>{t('history.filters')}</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Clock size={16} />
            <span>{t('history.timeRange')}</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <BarChart2 size={16} />
            <span>{t('history.metricType')}</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('history.date')}
                </th>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('history.metric')}
                </th>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('history.value')}
                </th>
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('history.notes')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {new Date(record.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {t(`profile.${record.metricType}`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{record.value}</span>
                    <span className="ml-1 text-sm text-gray-500">{record.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {record.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
            <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition">
              {t('history.addRecord')}
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <span>
                  {((currentPage - 1) * recordsPerPage) + 1}-
                  {Math.min(currentPage * recordsPerPage, mockHealthRecords.length)} of {mockHealthRecords.length}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  {t('common.previous')}
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  {t('common.next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthHistoryTab;