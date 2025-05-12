import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Search, ChevronDown, ChevronUp, Check } from 'lucide-react';
import DrinksManager from './DrinksManager';

export default function SearchableDrinksMenu({
    drinksMenu,
    value,
    onChange,
    placeholder = 'Search or select…',
}) {
    const [term, setTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(0);

    const inpRef = useRef(null);
    const ddRef = useRef(null);

    const allOpts = useMemo(
        () => drinksMenu.map(d => ({ id: d.id, label: d.name })),
        [drinksMenu]
    );

    const filtered = useMemo(() => {
        if (!term.trim()) return allOpts;
        const dm = new DrinksManager(drinksMenu);
        dm.load();
        return dm.searchDrinks(term).map(d => ({ id: d.id, label: d.name }));
    }, [term, drinksMenu, allOpts]);

    const selectedOpt = useMemo(
        () => allOpts.find(o => o.id === value) || null,
        [allOpts, value]
    );

    useEffect(() => {
        if (selectedOpt) {
            setTerm(selectedOpt.label);
            setHighlighted(allOpts.indexOf(selectedOpt));
        }
    }, [selectedOpt, allOpts]);

    useEffect(() => {
        const onClick = e => {
            if (
                inpRef.current?.contains(e.target) === false &&
                ddRef.current?.contains(e.target) === false
            ) {
                setOpen(false);
                // revert any half-typed term back to the chosen label
                if (selectedOpt) {
                    setTerm(selectedOpt.label);
                }
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [selectedOpt]);

    const onKeyDown = e => {
        if (!open) {
            if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlighted(i => Math.min(i + 1, filtered.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlighted(i => Math.max(i - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                filtered[highlighted] && select(filtered[highlighted]);
                break;
            case 'Escape':
                e.preventDefault();
                setOpen(false);
                selectedOpt && setTerm(selectedOpt.label);
                break;
            default:
        }
    };

    const select = opt => {
        setTerm(opt.label);
        onChange(opt.id);
        setOpen(false);
        inpRef.current.blur();
    };

    return (
        <div className="relative w-full max-w-sm" onKeyDown={onKeyDown}>
            <div
                className={`flex items-center border rounded ${open
                        ? 'border-coffee-dark ring-1 ring-coffee-dark/30'
                        : 'border-gray-300'
                    }`}
                onClick={() => setOpen(true)}
            >
                <Search className="ml-2 h-5 w-5 text-gray-500" />
                <input
                    ref={inpRef}
                    type="text"
                    className="flex-1 px-2 py-2 bg-transparent outline-none"
                    placeholder={placeholder}
                    value={term}
                    onChange={e => {
                        setTerm(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                />
                <div className="pr-2">
                    {open
                        ? <ChevronUp className="h-5 w-5 text-gray-500" />
                        : <ChevronDown className="h-5 w-5 text-gray-500" />}
                </div>
            </div>

            {open && (
                <ul
                    ref={ddRef}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-300
                     rounded shadow max-h-60 overflow-y-auto"
                >
                    {filtered.length > 0 ? (
                        filtered.map((opt, idx) => (
                            <li
                                key={opt.id}
                                className={`flex items-center px-3 py-2 cursor-pointer ${idx === highlighted ? 'bg-coffee-dark/10' : 'hover:bg-gray-50'
                                    }`}
                                onMouseEnter={() => setHighlighted(idx)}
                                onClick={() => select(opt)}
                            >
                                <div className="w-5 flex justify-center">
                                    {selectedOpt?.id === opt.id && (
                                        <Check className="h-4 w-4 text-coffee-dark" />
                                    )}
                                </div>
                                <span className="ml-2 text-coffee-dark">{opt.label}</span>
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-gray-500">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
}

SearchableDrinksMenu.propTypes = {
    drinksMenu: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
};
