export interface TeamMember {
    id: string;
    name: string;
    initials: string;
    color: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
    { id: '1c6c1eec-73e1-4161-9397-2688e862b834', name: 'Habiba Ali', initials: 'HA', color: 'bg-purple-100 text-purple-700' },
    { id: '22222222-2222-4222-a222-222222222222', name: 'Ahmed Hassan', initials: 'AH', color: 'bg-blue-100 text-blue-700' },
    { id: '33333333-3333-4333-a333-333333333333', name: 'Salma Youssef', initials: 'SY', color: 'bg-green-100 text-green-700' },
    { id: '44444444-4444-4444-a444-444444444444', name: 'Mai Mahmoud', initials: 'MM', color: 'bg-orange-100 text-orange-700' },
];