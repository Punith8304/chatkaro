export default function debounce(cb: (search: string) => Promise<void>, delay: number): (search: string) => void {
    let currentTime: ReturnType<typeof setTimeout>;
    return (search: string) => {
        clearTimeout(currentTime);
        if(!search) return;
        currentTime = setTimeout(() => {
            cb(search)
        }, delay)
    }
}