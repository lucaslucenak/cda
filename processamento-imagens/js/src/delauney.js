let Delaunay;

(function () {
    "use strict";

    const EPSILON = 1.0 / 1048576.0;

    function superTriangle(vertices) {
        let xMin = Number.POSITIVE_INFINITY,
            yMin = Number.POSITIVE_INFINITY,
            xMax = Number.NEGATIVE_INFINITY,
            yMax = Number.NEGATIVE_INFINITY,
            i, dx, dy, dMax, xMid, yMid;

        for (i = vertices.length; i--;) {
            if (vertices[i][0] < xMin) xMin = vertices[i][0];
            if (vertices[i][0] > xMax) xMax = vertices[i][0];
            if (vertices[i][1] < yMin) yMin = vertices[i][1];
            if (vertices[i][1] > yMax) yMax = vertices[i][1];
        }

        dx = xMax - xMin;
        dy = yMax - yMin;
        dMax = Math.max(dx, dy);
        xMid = xMin + dx * 0.5;
        yMid = yMin + dy * 0.5;

        return [
            [xMid - 20 * dMax, yMid - dMax],
            [xMid, yMid + 20 * dMax],
            [xMid + 20 * dMax, yMid - dMax]
        ];
    }

    function circumCircle(vertices, i, j, k) {
        let x1 = vertices[i][0],
            y1 = vertices[i][1],
            x2 = vertices[j][0],
            y2 = vertices[j][1],
            x3 = vertices[k][0],
            y3 = vertices[k][1],
            fabsy1y2 = Math.abs(y1 - y2),
            fabsy2y3 = Math.abs(y2 - y3),
            xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

        /* checando pontos que coincidem */
        if (fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
            throw new Error("Eek! Coincident points!");

        if (fabsy1y2 < EPSILON) {
            m2 = -((x3 - x2) / (y3 - y2));
            mx2 = (x2 + x3) / 2.0;
            my2 = (y2 + y3) / 2.0;
            xc = (x2 + x1) / 2.0;
            yc = m2 * (xc - mx2) + my2;
        } else if (fabsy2y3 < EPSILON) {
            m1 = -((x2 - x1) / (y2 - y1));
            mx1 = (x1 + x2) / 2.0;
            my1 = (y1 + y2) / 2.0;
            xc = (x3 + x2) / 2.0;
            yc = m1 * (xc - mx1) + my1;
        } else {
            m1 = -((x2 - x1) / (y2 - y1));
            m2 = -((x3 - x2) / (y3 - y2));
            mx1 = (x1 + x2) / 2.0;
            mx2 = (x2 + x3) / 2.0;
            my1 = (y1 + y2) / 2.0;
            my2 = (y2 + y3) / 2.0;
            xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
            yc = (fabsy1y2 > fabsy2y3) ?
                m1 * (xc - mx1) + my1 :
                m2 * (xc - mx2) + my2;
        }

        dx = x2 - xc;
        dy = y2 - yc;
        return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
    }

    function dedup(edges) {
        let i, j, a, b, m, n;
        for (j = edges.length; j;) {
            b = edges[--j];
            a = edges[--j];

            for (i = j; i;) {
                n = edges[--i];
                m = edges[--i];

                if ((a === m && b === n) || (a === n && b === m)) {
                    edges.splice(j, 2);
                    edges.splice(i, 2);
                    break;
                }
            }
        }
    }

    Delaunay = {
        triangulate: function (vertices, key) {
            var n = vertices.length,
                i, j, indices, st, open, closed, edges, dx, dy, a, b, c;

            /* avança se não houver vértices suficientes pra formar triângulo */
            if (n < 3)
                return [];

            /* corta os vertices dos objetos que passaram */
            vertices = vertices.slice(0);

            if (key)
                for (i = n; i--;)
                    vertices[i] = vertices[i][key];

            /* monta um array de indices de acordo com os vertices, ordenado pelo
             * vertice x.*/
            indices = new Array(n);

            for (i = n; i--;)
                indices[i] = i;

            indices.sort(function (i, j) {
                var diff = vertices[j][0] - vertices[i][0];
                return diff !== 0 ? diff : i - j;
            });

            /* acha os vertices do triangulo maior , 
            *  e anexa os triangulo menores num copyof dos vertices do array
            */
            st = superTriangle(vertices);
            vertices.push(st[0], st[1], st[2]);

            /* lista vazia que contem o supertriangulo vazio 
            * e uma lista fechada vazia 
            */
            open = [circumCircle(vertices, n + 0, n + 1, n + 2)];
            closed = [];
            edges = [];

            /* adiciona um a um cada vertice na tela */
            for (i = indices.length; i--; edges.length = 0) {
                c = indices[i];

                /* pra cada triangulo aberto, verifica se o ponto atual
                 * está dentro de circumCircle. se sim, remove o triangulo e adiciona
                 * it's edges to an edge list. */
                for (j = open.length; j--;) {
                    /* If this point is to the right of this triangle's circumCircle,
                     * then this triangle should never get checked again. Remove it
                     * from the open list, add it to the closed list, and skip. */
                    dx = vertices[c][0] - open[j].x;
                    if (dx > 0.0 && dx * dx > open[j].r) {
                        closed.push(open[j]);
                        open.splice(j, 1);
                        continue;
                    }

                    /* If we're outside the circumCircle, skip this triangle. */
                    dy = vertices[c][1] - open[j].y;
                    if (dx * dx + dy * dy - open[j].r > EPSILON)
                        continue;

                    /* Remove the triangle and add it's edges to the edge list. */
                    edges.push(
                        open[j].i, open[j].j,
                        open[j].j, open[j].k,
                        open[j].k, open[j].i
                    );
                    open.splice(j, 1);
                }

                /* Remove any doubled edges. */
                dedup(edges);

                /* Add a new triangle for each edge. */
                for (j = edges.length; j;) {
                    b = edges[--j];
                    a = edges[--j];
                    open.push(circumCircle(vertices, a, b, c));
                }
            }

            /* Copy any remaining open triangles to the closed list, and then
             * remove any triangles that share a vertex with the supertriangle,
             * building a list of triplets that represent triangles. */
            for (i = open.length; i--;)
                closed.push(open[i]);
            open.length = 0;

            for (i = closed.length; i--;)
                if (closed[i].i < n && closed[i].j < n && closed[i].k < n)
                    open.push(closed[i].i, closed[i].j, closed[i].k);

            /* Yay, we're done! */
            return open;
        },
        contains: function (tri, p) {
            /* Bounding box test first, for quick rejections. */
            if ((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
                (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
                (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
                (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1]))
                return null;

            var a = tri[1][0] - tri[0][0],
                b = tri[2][0] - tri[0][0],
                c = tri[1][1] - tri[0][1],
                d = tri[2][1] - tri[0][1],
                i = a * d - b * c;

            /* Degenerate tri. */
            if (i === 0.0)
                return null;

            var u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i,
                v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;

            /* If we're outside the tri, fail. */
            if (u < 0.0 || v < 0.0 || (u + v) > 1.0)
                return null;

            return [u, v];
        }
    };

    if (typeof module !== "undefined")
        module.exports = Delaunay;
})();
