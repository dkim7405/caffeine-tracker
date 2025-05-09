import PropTypes from 'prop-types';
import { Edit, Trash2, Check, X } from 'lucide-react';

function LogsList({
    logs,
    editingTime,
    editCaffeine,
    editDrinkType,
    setEditCaffeine,
    setEditDrinkType,
    onStartEditing,
    onSaveEdit,
    onCancelEdit,
    onDelete,
}) {
    const grouped = groupAndSortLogs(logs);

    return (
        <div className="space-y-6">
            {Object.keys(grouped).length === 0 ? (
                <p className="text-center text-gray-500">No Entries</p>
            ) : (
                Object.entries(grouped).map(([date, entries]) => (
                    <div key={date} className="space-y-4">
                        <h2 className="text-xl font-semibold text-coffee-dark">{date}</h2>
                        {entries.map((entry, i) => {
                            const isEditing = editingTime === extractTime(entry.time_added);
                            return (
                                <div
                                    key={i}
                                    className="p-6 bg-white shadow-md rounded-lg mb-3 flex flex-col md:flex-row justify-between items-start md:items-center"
                                >
                                    {isEditing ? (
                                        <LogsItemEdit
                                            editCaffeine={editCaffeine}
                                            editDrinkType={editDrinkType}
                                            setEditCaffeine={setEditCaffeine}
                                            setEditDrinkType={setEditDrinkType}
                                            onSave={onSaveEdit}
                                            onCancel={onCancelEdit}
                                        />
                                    ) : (
                                        <LogsItem
                                            entry={entry}
                                            onStartEditing={onStartEditing}
                                            onDelete={onDelete}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))
            )}
        </div>
    );
}

LogsList.propTypes = {
    logs: PropTypes.array.isRequired,
    editingTime: PropTypes.string,
    editCaffeine: PropTypes.string,
    editDrinkType: PropTypes.string,
    setEditCaffeine: PropTypes.func,
    setEditDrinkType: PropTypes.func,
    onStartEditing: PropTypes.func,
    onSaveEdit: PropTypes.func,
    onCancelEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

export default LogsList;

function LogsItem({ entry, onStartEditing, onDelete }) {
    return (
        <>
            <div className="mr-6 text-xs text-coffee-dark/70">{formatTime(extractTime(entry.time_added))}</div>
            <div className="flex-1">
                <p className="text-lg font-semibold text-coffee-dark mb-1">{entry.drink_name || 'Unknown'}</p>
                <p className="text-md text-coffee-dark mb-1">{entry.total_amount} mg</p>
            </div>
            <div className="flex space-x-2 mt-2 md:mt-0">
                <button
                    onClick={() => onStartEditing(entry)}
                    className="border-2 border-coffee-dark text-coffee-dark px-4 py-2 rounded-lg hover:bg-coffee-dark hover:text-white"
                >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(entry.time_added)}
                    className="bg-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white"
                >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                </button>
            </div>
        </>
    );
}

function LogsItemEdit({ editCaffeine, editDrinkType, setEditCaffeine, setEditDrinkType, onSave, onCancel }) {
    return (
        <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between">
            <div className="space-y-4">
                <div>
                    <label className="block text-md text-coffee-dark font-semibold mb-2">Drink Type:</label>
                    <input
                        type="text"
                        className="border border-coffee-dark/50 rounded-lg px-3 py-2 w-56 shadow-sm"
                        value={editDrinkType}
                        onChange={(e) => setEditDrinkType(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-md text-coffee-dark font-semibold mb-2">Caffeine (mg):</label>
                    <input
                        type="number"
                        className="border border-coffee-dark/50 rounded-lg px-3 py-2 w-56 shadow-sm"
                        value={editCaffeine}
                        onChange={(e) => setEditCaffeine(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                    onClick={onSave}
                    className="border-2 border-coffee-dark text-coffee-dark px-4 py-2 rounded-lg hover:bg-coffee-dark hover:text-white"
                >
                    <Check className="w-5 h-5 mr-2" />
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="bg-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white"
                >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                </button>
            </div>
        </div>
    );
}

function extractTime(dateTimeStr) {
    return dateTimeStr.split('T')[1].split('.')[0];
}

function formatTime(timeStr) {
    const [hour, min, sec] = timeStr.split(':').map(Number);
    return new Date(0, 0, 0, hour, min, sec).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

function groupAndSortLogs(logs) {
    if (!logs || logs.length === 0) {
        return {};
    }

    logs.sort((a, b) => new Date(b.time_added) - new Date(a.time_added));

    return logs.reduce((acc, log) => {
        const date = log.time_added.split('T')[0];
        acc[date] = acc[date] || [];
        acc[date].push(log);
        return acc;
    }, {});
}
