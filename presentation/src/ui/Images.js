sss.__scroll = { __onlyScrollY: 1 };

$each([fit1, fit2, fit3, fit4, fit5], n => {
    n.__init({
        __onTapHighlight: 1,
        __back() {
            var t = this;
            t.__killAllAnimations();
            t.__anim(t.__bsf, 0.3);
            t.a = 0;
            if (sss.lala == t) {
                sss.lala = 0;
            }
            t.__z = -150;
            _setTimeout(() => { if (!t.a) t.__z = -100; }, 0.3);
        },
        __onTap() {
            var t = this;
            t.__killAllAnimations();
            if (!t.__bsf) {
                t.__bsf = { __width: t.__width, __height: t.__height };
            }
            if (t.a) {
                t.__back();
            } else {
                if (sss.lala) {
                    sss.lala.__back();
                }
                sss.lala = t;
                t.a = 1;
                t.__z = -221;
                t.__anim({ __width: t.__bsf.__width + 30 }, 1.0, 0, easeBackO)
                    .__anim({ __height: t.__bsf.__height + 30 }, 0.6, 0, easeBackO, 0.4);
            }
        }
    });
});
