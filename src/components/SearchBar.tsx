'use client';

import { Icons } from './Icons';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div
            className="search-container"
            style={{ marginBottom: '32px', maxWidth: '500px' }}
        >
            <Icons.Search />
            <input
                type="text"
                className="input-glass"
                placeholder="Prompt veya tag ara..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
