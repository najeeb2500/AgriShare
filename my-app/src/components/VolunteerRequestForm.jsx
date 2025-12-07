import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function VolunteerRequestForm({ volunteerId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'seeds',
    quantity: '',
    specificType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Debug: Check volunteerId
  console.log('VolunteerRequestForm received volunteerId:', volunteerId);

  const seedTypes = ['Tomato', 'Carrot', 'Lettuce', 'Spinach', 'Wheat', 'Rice', 'Corn', 'Other'];
  const toolTypes = ['Spade', 'Hoe', 'Rake', 'Shovel', 'Pruner', 'Watering Can', 'Pitchfork', 'Other'];
  const fertilizerTypes = ['Organic', 'NPK', 'Urea', 'Compost', 'Other'];
  const waterTypes = ['Tap', 'Well', 'Rainwater', 'Borewell', 'Other'];

  const getSpecificTypes = () => {
    switch(formData.type) {
      case 'seeds': return seedTypes;
      case 'tools': return toolTypes;
      case 'fertilizer': return fertilizerTypes;
      case 'water': return waterTypes;
      default: return [];
    }
  };

  const resourceTypes = [
    { value: 'seeds', label: '🌱 Seeds' },
    { value: 'tools', label: '🛠️ Tools' },
    { value: 'fertilizer', label: '🥕 Fertilizer' },
    { value: 'water', label: '💧 Water' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.quantity.trim()) {
      setError('Please enter quantity');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      const payload = {
        volunteerId,
        type: formData.type,
        quantity: formData.quantity,
        specificType: formData.specificType || null
      };

      console.log('Sending volunteer request:', payload);

      const response = await fetch('http://localhost:5000/api/volunteer-requests/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server error response:', data);
        throw new Error(data.error || data.message || `Server error: ${response.status}`);
      }

      console.log('Request created successfully:', data);

      setSuccess('Request sent successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Request creation failed:', err);
      setError(err.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Request Resources</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle size={20} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Resource Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Resource Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {resourceTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition ${
                      formData.type === type.value
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Quantity *
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 10 kg, 5 bags, 100 liters"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Include unit (kg, bags, liters, etc.)</p>
            </div>

            {/* Specific Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Specific Type <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <select
                name="specificType"
                value={formData.specificType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select or skip --</option>
                {getSpecificTypes().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.type === 'seeds' && 'Select seed variety (e.g., Tomato, Carrot)'}
                {formData.type === 'tools' && 'Select tool type (e.g., Spade, Hoe)'}
                {formData.type === 'fertilizer' && 'Select fertilizer type (e.g., Organic, NPK)'}
                {formData.type === 'water' && 'Select water source type'}
              </p>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                ℹ️ Your request will be reviewed by an admin. You'll be notified once it's approved or rejected.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
