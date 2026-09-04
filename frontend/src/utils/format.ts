export function formatRelativeTime(isoDate: string) {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '';

    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
}

export function getShareUrl(shareId: string) {
    return `${window.location.origin}/share/${shareId}`;
}

export async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
}
