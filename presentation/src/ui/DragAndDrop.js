kitten.__init({
    __drag(x, y, dx, dy) {
        this.__x += dx;
        this.__y += dy;
    },
    __dragEnd() {
        var t = this;
        if (t.__screenPosition().__distanceTo(bed.__screenPosition()) < bed.__size.__length() / 2) {
            t.__anim({ __x: bed.__x + 20, __y: bed.__y - 160 }, 0.3);
            t.__anim({ __scaleF: 1.1 }, 0.2, -2);
        }
    }
});