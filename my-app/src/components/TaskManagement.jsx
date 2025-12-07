import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lands, setLands] = useState([]);
  const [users, setUsers] = useState([]);
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    land: '',
    assignedTo: '',
    category: 'maintenance',
    priority: 'medium',
    dueDate: '',
    estimatedDuration: 1,
    instructions: '',
  });

  const [statusUpdate, setStatusUpdate] = useState({});

  useEffect(() => {
    fetchTasks();   
    fetchLands();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
     

     

      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: {
       
        }
      });

      if (res.status === 401 || res.status === 403) {
        setError('Authentication failed. Please log in again.');
        // localStorage.removeItem('token');
        // setTimeout(() => window.location.href = '/login', 2000);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }

      const data = await res.json();
      setTasks(data.tasks || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks. Please check your connection.');
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

 const fetchLands = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/lands/available');
    const data = await res.json();
    console.log('Lands data:', data);
    
    const filteredLands = (data.lands || []).filter(land =>
      land.allocatedTo.user !== null ||
      land.allocatedTo.gardener !== null 
    );


    setLands(filteredLands || []);
  } catch (err) {
    console.error('Failed to fetch lands:', err);
  }
};


  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/', {
        headers: {
        }
      });
      const data = await res.json();
      
      // Filter users with gardener role
      const filteredUsers = (data || []).filter(user =>
        user.role === 'gardener' 
      );

      console.log('Users data:', data);
      console.log('Filtered gardeners:', filteredUsers);
      setUsers(filteredUsers || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedDuration' ? parseInt(value) : value
    }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
    
      console.log('Form Data.userId:', localStorage.getItem("user"));
      const a = JSON.parse(localStorage.getItem("user"));
     const userId = a.id;                                 // extract id

const res = await fetch(`http://localhost:5000/api/tasks/?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to create task');

      setSuccess('Task created successfully!');
      setFormData({
        title: '',
        description: '',
        land: '',
        assignedTo: '',
        category: 'maintenance',
        priority: 'medium',
        dueDate: '',
        estimatedDuration: 1,
        instructions: ''
      });
      setShowCreateForm(false);
      fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create task');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId) => {
    try {
      setLoading(true);
     
      const newStatus = statusUpdate[taskId];

      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}/status?userId=${JSON.parse(localStorage.getItem("user")).id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update task status');

      setSuccess('Task status updated successfully!');
      setStatusUpdate(prev => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
      fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update task status');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setLoading(true);


      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
        }
      });

      if (!res.ok) throw new Error('Failed to delete task');

      setSuccess('Task deleted successfully!');
      fetchTasks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'on_hold':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
              <p className="text-gray-600 mt-1">Create, view, and manage tasks</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={20} />
              Create Task
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {/* Create Task Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter task title"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="planting">Planting</option>
                    <option value="watering">Watering</option>
                    <option value="fertilizing">Fertilizing</option>
                    <option value="harvesting">Harvesting</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Land */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land *
                  </label>
                  <select
                    name="land"
                    value={formData.land}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a land</option>
                    {lands.map(land => (
                      <option key={land._id} value={land._id}>
                        {land.title || land.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To *
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a gardener</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Estimated Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Duration (hours)
                  </label>
                  <input
                    type="number"
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe the task in detail"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Step-by-step instructions for the task"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              All Tasks ({tasks.length})
            </h2>
          </div>

          {loading && !showCreateForm ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-600">Get started by creating a new task.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks.map(task => (
                    <tr key={task._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{task.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-semibold ${getPriorityColor(task.priority)} uppercase text-xs`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <select
                            value={statusUpdate[task._id] || task.status}
                            onChange={(e) => setStatusUpdate(prev => ({
                              ...prev,
                              [task._id]: e.target.value
                            }))}
                            className={`px-3 py-1 rounded text-sm font-medium border-0 ${getStatusColor(task.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="on_hold">On Hold</option>
                          </select>
                          {statusUpdate[task._id] && statusUpdate[task._id] !== task.status && (
                            <button
                              onClick={() => handleStatusUpdate(task._id)}
                              disabled={loading}
                              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {task.assignedTo?.name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            disabled={loading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                            title="Delete task"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Task Details Card View (Optional - for better mobile view) */}
        <div className="mt-8 md:hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Cards</h2>
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task._id} className="bg-white rounded-lg shadow p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{task.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className={`font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due:</span>
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned:</span>
                    <span>{task.assignedTo?.name || 'Unassigned'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <select
                    value={statusUpdate[task._id] || task.status}
                    onChange={(e) => setStatusUpdate(prev => ({
                      ...prev,
                      [task._id]: e.target.value
                    }))}
                    className={`w-full px-3 py-2 rounded text-sm font-medium border-0 ${getStatusColor(task.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="on_hold">On Hold</option>
                  </select>

                  <div className="flex gap-2">
                    {statusUpdate[task._id] && statusUpdate[task._id] !== task.status && (
                      <button
                        onClick={() => handleStatusUpdate(task._id)}
                        disabled={loading}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 text-sm"
                      >
                        Save Status
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      disabled={loading}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
