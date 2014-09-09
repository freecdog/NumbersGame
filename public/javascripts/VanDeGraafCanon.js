/**
 * Created by jaric on 09.09.2014.
 */

// Van de Graaf Canon
(function(exports){

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var line = function(a, b, c){
        return {a: a, b: b, c: c};
    };

    var abs = Math.abs;

    function lineFromCoords(x1,y1,x2,y2){
        return new line(y1 - y2, x2 - x1, det(x1,y1,x2,y2));
    }
    // http://e-maxx.ru/algo/lines_intersection
    var EPS = 1e-9;
    function parallel (m, n) {
        return abs (det (m.a, m.b, n.a, n.b)) < EPS;
    }
    function det(a, b, c, d) {
        return a * d - b * c;
    }
    function equivalent (m, n) {
        return abs (det (m.a, m.b, n.a, n.b)) < EPS
            && abs (det (m.a, m.c, n.a, n.c)) < EPS
            && abs (det (m.b, m.c, n.b, n.c)) < EPS;
    }
    function intersect (m, n, res) {
        var zn = det (m.a, m.b, n.a, n.b);
        if (abs (zn) < EPS)
            return false;
        res.x = - det (m.c, m.b, n.c, n.b) / zn;
        res.y = - det (m.a, m.c, n.a, n.c) / zn;
        return true;
    }


    exports.vanDeGraafCanon = function(X,Y,W,H){
        if (!isNumber(X) || !isNumber(Y) || !isNumber(W) || !isNumber(H)){
            console.log('corrupted values', X, Y, W, H);
            return;
        }
        var XA, XB, XC, XD, XE, XF, XK, XM, XN, XO, XP, XQ, XR, XS, XW;
        var YA, YB, YC, YD, YE, YF, YK, YM, YN, YO, YP, YQ, YR, YS, YW;

        // 0. Init
        XA = X;     YA = Y;
        XB = XA + W; YB = YA;
        XC = XB; YC = YB + H;
        XD = XA;     YD = YC;

        // 1. E, F?
        XE = (XA + XB) / 2; YE = YA;
        XF = XE;            YF = YC;

        // 2. M, K?
        var coordsM = {x: 0, y: 0};
        if (!intersect(lineFromCoords(XE,YE,XC,YC), lineFromCoords(XD,YD,XB,YB), coordsM)){
            console.log('lines does not intersect', XE,YE,XC,YC, 'and', XD,YD,XB,YB);
            return;
        }
        XM = coordsM.x; YM = coordsM.y;

        var coordsK = {x: 0, y: 0};
        if (!intersect(lineFromCoords(XD,YD,XE,YE), lineFromCoords(XA,YA,XC,YC), coordsK)){
            console.log('lines does not intersect', XD,YD,XE,YE, 'and', XA,YA,XC,YC);
            return;
        }
        XK = coordsK.x; YK = coordsK.y;

        // 3 N ?
        XN = XM;    YN = YA;

        // 4 P ?
        var coordsP = {x: 0, y: 0};
        if (!intersect(lineFromCoords(XC,YC,XE,YE), lineFromCoords(XK,YK,XN,YN), coordsP)){
            console.log('lines does not intersect', XC,YC,XE,YE, 'and', XK,YK,XN,YN);
            return;
        }
        XP = coordsP.x; YP = coordsP.y;

        // 5 Q ?
        XW = XB;        YW = YP;
        var coordsQ = {x: 0, y: 0};
        if (!intersect(lineFromCoords(XD,YD,XB,YB), lineFromCoords(XP,YP,XW,YW), coordsQ)){
            console.log('lines does not intersect', XD,YD,XB,YB, 'and', XP,YP,XW,YW);
            return;
        }
        XQ = coordsQ.x; YQ = coordsQ.y;

        // 6 R, S?
        var diamO = XB - XE;
        XR = XQ;        YR = YQ + diamO;
        XS = XP;        YS = YR;

        // 7 left frame
        var X1, X2, X3, X4;
        var Y1, Y2, Y3, Y4;
        X1 = XE - (XQ - XE);    Y1 = YP;
        X2 = XE - (XP - XE);    Y2 = Y1;
        X3 = X2;                Y3 = YR;
        X4 = X1;                Y4 = Y3;

        var ans = [
            {
                left: X1,
                top: Y1,
                width: (X2-X1),
                height: (Y4-Y1)
            },{
                left: XP,
                top: YP,
                width: (XR-XP),
                height: (YS-YP)
            }];

        return ans;
    }

})(typeof exports === 'undefined'? this['VanDeGraafCanon']={} : exports);