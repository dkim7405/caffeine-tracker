import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LogsList from './LogsList';

function Logs({ userId, db }) {
    const [addsData, setAddsData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Exact timestamp for update
    const [originalTimeAdded, setOriginalTimeAdded] = useState(null);

    const [editingTime, setEditingTime] = useState('');
    const [editingDate, setEditingDate] = useState('');
    const [editCaffeine, setEditCaffeine] = useState('');
    const [editDrinkType, setEditDrinkType] = useState('');

    const fetchLogs = async () => {
        try {
            const data = await db.getUserAdds(userId);
            setAddsData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (entry) => {
        setOriginalTimeAdded(entry.time_added);

        // for display
        const [date, timeWithMs] = entry.time_added.split('T');
        const time = timeWithMs.split('.')[0];

        setEditingDate(date);
        setEditingTime(time);
        setEditCaffeine(String(entry.total_amount));
        setEditDrinkType(entry.drink_id);
    };

    const handleSaveEdit = async () => {
        if (!originalTimeAdded) {
            return;
        }

        try {
            await db.updateDrinkEntry(
                userId,
                originalTimeAdded,
                editDrinkType,
                parseFloat(editCaffeine)
            );

            cancelEdit();
            fetchLogs();
        } catch (err) {
            console.error('Error updating drink entry:', err);
        }
    };

    const handleDelete = async (timeAdded) => {
        try {
            await db.deleteDrinkEntry(userId, timeAdded);
            fetchLogs();
        } catch (err) {
            console.error(err);
        }
    };

    const cancelEdit = () => {
        setOriginalTimeAdded(null);
        setEditingTime('');
        setEditingDate('');
        setEditCaffeine('');
        setEditDrinkType('');
    };

    useEffect(() => {
        if (userId && db) {
            fetchLogs();
        }
    }, [userId, db]);

    if (!userId) {
        return <p className="p-4 text-red-600">User ID not provided.</p>;
    }
    if (loading) {
        return <p className="p-4">Loading...</p>;
    }

    return (
        <div className="w-full h-screen flex flex-col bg-white overflow-y-auto">
            <div className="bg-coffee-dark p-4 shadow text-white">
                <h1 className="text-2xl">Caffeine Logs</h1>
            </div>
            <div className="p-4 flex-1">
                <LogsList
                    db={db}
                    logs={addsData}
                    editingTime={editingTime}
                    editingDate={editingDate}
                    editCaffeine={editCaffeine}
                    editDrinkType={editDrinkType}
                    setEditCaffeine={setEditCaffeine}
                    setEditDrinkType={setEditDrinkType}
                    onStartEditing={startEditing}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={cancelEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}

Logs.propTypes = {
    userId: PropTypes.number.isRequired,
    db: PropTypes.object.isRequired,
};

export default Logs;
