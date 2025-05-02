import { useEffect } from 'react';

export default function useHorizontalDragScroll(ref) {
    useEffect(() => {
        const scrollContainer = ref.current;
        if (!scrollContainer) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        const onMouseDown = (e) => {
            isDown = true;
            scrollContainer.classList.add('cursor-grabbing');
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        };

        const onMouseLeave = () => {
            isDown = false;
            scrollContainer.classList.remove('cursor-grabbing');
        };

        const onMouseUp = () => {
            isDown = false;
            scrollContainer.classList.remove('cursor-grabbing');
        };

        const onMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 1;
            scrollContainer.scrollLeft = scrollLeft - walk;
        };

        scrollContainer.addEventListener('mousedown', onMouseDown);
        scrollContainer.addEventListener('mouseleave', onMouseLeave);
        scrollContainer.addEventListener('mouseup', onMouseUp);
        scrollContainer.addEventListener('mousemove', onMouseMove);

        return () => {
            scrollContainer.removeEventListener('mousedown', onMouseDown);
            scrollContainer.removeEventListener('mouseleave', onMouseLeave);
            scrollContainer.removeEventListener('mouseup', onMouseUp);
            scrollContainer.removeEventListener('mousemove', onMouseMove);
        };
    }, [ref]);
}
