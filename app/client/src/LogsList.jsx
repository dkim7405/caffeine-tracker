// LogsList.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2, Check, X } from 'lucide-react';
import SearchableDrinksMenu from './SearchableDrinksMenu';

export default function LogsList({
    db,
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
    const [drinksMenu, setDrinksMenu] = useState([]);

    useEffect(() => {
        db.getDrinks()
            .then(setDrinksMenu)
            .catch(console.error);
    }, [db]);

    const grouped = (logs || [])
        .slice()
        .sort((a, b) => new Date(b.time_added) - new Date(a.time_added))
        .reduce((acc, log) => {
            const date = log.time_added.split('T')[0];
            (acc[date] = acc[date] || []).push(log);
            return acc;
        }, {});

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([date, entries]) => (
                <div key={date} className="space-y-4">
                    <h2 className="text-xl font-semibold text-coffee-dark">{date}</h2>
                    {entries.map(entry => {
                        const isEditing = editingTime === extractTime(entry.time_added);
                        return (
                            <div
                                key={entry.time_added}
                                className="p-6 bg-white shadow-md rounded-lg mb-3 flex flex-col md:flex-row justify-between items-start md:items-center"
                            >
                                {isEditing ? (
                                    <EditRow
                                        drinksMenu={drinksMenu}
                                        caffeine={editCaffeine}
                                        drinkId={editDrinkType}
                                        setCaffeine={setEditCaffeine}
                                        setDrinkId={setEditDrinkType}
                                        onSave={onSaveEdit}
                                        onCancel={onCancelEdit}
                                    />
                                ) : (
                                    <ViewRow
                                        entry={entry}
                                        onEdit={() => onStartEditing(entry)}
                                        onDelete={() => onDelete(entry.time_added)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
            {Object.keys(grouped).length === 0 && (
                <p className="text-center text-gray-500">No entries</p>
            )}
        </div>
    );
}

LogsList.propTypes = {
    db: PropTypes.object.isRequired,
    logs: PropTypes.array.isRequired,
    editingTime: PropTypes.string,
    editCaffeine: PropTypes.string.isRequired,
    editDrinkType: PropTypes.number,
    setEditCaffeine: PropTypes.func.isRequired,
    setEditDrinkType: PropTypes.func.isRequired,
    onStartEditing: PropTypes.func.isRequired,
    onSaveEdit: PropTypes.func.isRequired,
    onCancelEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

function ViewRow({ entry, onEdit, onDelete }) {
    return (
        <>
            <div className="mr-6 text-xs text-coffee-dark/70">
                {formatTime(extractTime(entry.time_added))}
            </div>
            <div className="flex-1">
                <p className="font-semibold text-coffee-dark mb-1">
                    {entry.drink_name || 'Unknown'}
                </p>
                <p className="text-coffee-dark">{entry.total_amount} mg</p>
            </div>
            <div className="flex space-x-2 mt-2 md:mt-0">
                <button
                    onClick={onEdit}
                    className="flex items-center border-2 border-coffee-dark px-2 py-2 rounded hover:bg-coffee-dark hover:text-white"
                >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center bg-red-200 text-red-600 px-2 py-2 rounded hover:bg-red-600 hover:text-white"
                >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
            </div>
        </>
    );
}

ViewRow.propTypes = {
    entry: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

function EditRow({
    drinksMenu,
    caffeine,
    drinkId,
    setCaffeine,
    setDrinkId,
    onSave,
    onCancel,
}) {
    return (
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 space-y-4">
                <div>
                    <label className="block mb-1 font-semibold text-coffee-dark">
                        Drink
                    </label>
                    <SearchableDrinksMenu
                        drinksMenu={drinksMenu}
                        value={drinkId}
                        onChange={setDrinkId}
                        placeholder="Select…"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold text-coffee-dark">
                        Caffeine (mg)
                    </label>
                    <input
                        type="number"
                        className="border px-3 py-2 rounded w-40"
                        value={caffeine}
                        onChange={e => setCaffeine(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={onSave}
                    className="flex items-center border-2 border-coffee-dark px-2 py-2 rounded hover:bg-coffee-dark hover:text-white"
                >
                    <Check className="w-4 h-4 mr-1" /> Save
                </button>
                <button
                    onClick={onCancel}
                    className="flex items-center bg-red-200 text-red-600 px-2 py-2 rounded hover:bg-red-600 hover:text-white"
                >
                    <X className="w-4 h-4 mr-1" /> Cancel
                </button>
            </div>
        </div>
    );
}

EditRow.propTypes = {
    drinksMenu: PropTypes.array.isRequired,
    caffeine: PropTypes.string.isRequired,
    drinkId: PropTypes.number,
    setCaffeine: PropTypes.func.isRequired,
    setDrinkId: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

// Helpers

function extractTime(dateTime) {
    return dateTime.split('T')[1].split('.')[0];
}

function formatTime(timeStr) {
    const [h, m, s] = timeStr.split(':').map(Number);
    return new Date(0, 0, 0, h, m, s).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
