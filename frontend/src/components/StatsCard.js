export default function StatsCard({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 border-l-4' style={{ borderColor: 'var(--' + color + '-500)' }}>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-gray-500 text-sm font-medium'>{title} <span className={'text-white p-4 rounded-full text-2xl ' + colorClasses[color]}>
          {icon}
        </span></p>
          
          <p className='text-3xl font-bold mt-2'>{value}</p>
        </div>
        
      </div>
    </div>
  );
}
