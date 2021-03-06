describe('iD.Relation', function () {
    if (iD.debug) {
        it("freezes nodes", function () {
            expect(Object.isFrozen(iD.Relation().members)).to.be.true;
        });
    }

    it("returns a relation", function () {
        expect(iD.Relation()).to.be.an.instanceOf(iD.Relation);
        expect(iD.Relation().type).to.equal("relation");
    });

    it("returns a created Entity if no ID is specified", function () {
        expect(iD.Relation().created()).to.be.ok;
    });

    it("returns an unmodified Entity if ID is specified", function () {
        expect(iD.Relation({id: 'r1234'}).created()).not.to.be.ok;
        expect(iD.Relation({id: 'r1234'}).modified()).not.to.be.ok;
    });

    it("defaults members to an empty array", function () {
        expect(iD.Relation().members).to.eql([]);
    });

    it("sets members as specified", function () {
        expect(iD.Relation({members: ["n-1"]}).members).to.eql(["n-1"]);
    });

    it("defaults tags to an empty object", function () {
        expect(iD.Relation().tags).to.eql({});
    });

    it("sets tags as specified", function () {
        expect(iD.Relation({tags: {foo: 'bar'}}).tags).to.eql({foo: 'bar'});
    });

    describe("#extent", function () {
        it("returns the minimal extent containing the extents of all members");
    });

    describe("#multipolygon", function () {
        specify("single polygon consisting of a single way", function () {
            var a = iD.Node(),
                b = iD.Node(),
                c = iD.Node(),
                w = iD.Way({nodes: [a.id, b.id, c.id, a.id]}),
                r = iD.Relation({members: [{id: w.id, type: 'way'}]}),
                g = iD.Graph([a, b, c, w, r]);

            expect(r.multipolygon(g)).to.eql([[[a, b, c, a]]]);
        });

        specify("single polygon consisting of multiple ways", function () {
            var a  = iD.Node(),
                b  = iD.Node(),
                c  = iD.Node(),
                d  = iD.Node(),
                w1 = iD.Way({nodes: [a.id, b.id, c.id]}),
                w2 = iD.Way({nodes: [c.id, d.id, a.id]}),
                r  = iD.Relation({members: [{id: w2.id, type: 'way'}, {id: w1.id, type: 'way'}]}),
                g  = iD.Graph([a, b, c, d, w1, w2, r]);

            expect(r.multipolygon(g)).to.eql([[[a, b, c, d, a]]]); // TODO: not the only valid ordering
        });

        specify("single polygon consisting of multiple ways, one needing reversal", function () {
            var a  = iD.Node(),
                b  = iD.Node(),
                c  = iD.Node(),
                d  = iD.Node(),
                w1 = iD.Way({nodes: [a.id, b.id, c.id]}),
                w2 = iD.Way({nodes: [a.id, d.id, c.id]}),
                r  = iD.Relation({members: [{id: w2.id, type: 'way'}, {id: w1.id, type: 'way'}]}),
                g  = iD.Graph([a, b, c, d, w1, w2, r]);

            expect(r.multipolygon(g)).to.eql([[[a, b, c, d, a]]]); // TODO: not the only valid ordering
        });

        specify("multiple polygons consisting of single ways", function () {
            var a  = iD.Node(),
                b  = iD.Node(),
                c  = iD.Node(),
                d  = iD.Node(),
                e  = iD.Node(),
                f  = iD.Node(),
                w1 = iD.Way({nodes: [a.id, b.id, c.id, a.id]}),
                w2 = iD.Way({nodes: [d.id, e.id, f.id, d.id]}),
                r  = iD.Relation({members: [{id: w2.id, type: 'way'}, {id: w1.id, type: 'way'}]}),
                g  = iD.Graph([a, b, c, d, e, f, w1, w2, r]);

            expect(r.multipolygon(g)).to.eql([[[a, b, c, a]], [[d, e, f, d]]]);
        });

        specify("invalid geometry: unclosed ring consisting of a single way", function () {
            var a = iD.Node(),
                b = iD.Node(),
                c = iD.Node(),
                w = iD.Way({nodes: [a.id, b.id, c.id]}),
                r = iD.Relation({members: [{id: w.id, type: 'way'}]}),
                g = iD.Graph([a, b, c, w, r]);

            expect(r.multipolygon(g)).to.eql([[[a, b, c]]]);
        });

        specify("invalid geometry: unclosed ring consisting of multiple ways", function () {
            var a  = iD.Node(),
                b  = iD.Node(),
                c  = iD.Node(),
                d  = iD.Node(),
                w1 = iD.Way({nodes: [a.id, b.id, c.id]}),
                w2 = iD.Way({nodes: [c.id, d.id]}),
                r  = iD.Relation({members: [{id: w2.id, type: 'way'}, {id: w1.id, type: 'way'}]}),
                g  = iD.Graph([a, b, c, d, w1, w2, r]);

            expect(r.multipolygon(g)).to.eql([[[a, b, c, d]]]);
        });

        specify("invalid geometry: unclosed ring consisting of multiple ways, alternate order", function () {
            var a  = iD.Node(),
                b  = iD.Node(),
                c  = iD.Node(),
                d  = iD.Node(),
                w1 = iD.Way({nodes: [c.id, d.id]}),
                w2 = iD.Way({nodes: [a.id, b.id, c.id]}),
                r  = iD.Relation({members: [{id: w2.id, type: 'way'}, {id: w1.id, type: 'way'}]}),
                g  = iD.Graph([a, b, c, d, w1, w2, r]);

            expect(r.multipolygon(g)).to.eql([[[a, b, c, d]]]);
        });

        specify("invalid geometry: unclosed ring consisting of multiple ways, one needing reversal", function () {
            var a  = iD.Node(),
                b  = iD.Node(),
                c  = iD.Node(),
                d  = iD.Node(),
                w1 = iD.Way({nodes: [a.id, b.id, c.id]}),
                w2 = iD.Way({nodes: [d.id, c.id]}),
                r  = iD.Relation({members: [{id: w2.id, type: 'way'}, {id: w1.id, type: 'way'}]}),
                g  = iD.Graph([a, b, c, d, w1, w2, r]);

            expect(r.multipolygon(g)).to.eql([[[a, b, c, d]]]);
        });

        specify("invalid geometry: unclosed ring consisting of multiple ways, one needing reversal, alternate order", function () {
            var a  = iD.Node(),
                b  = iD.Node(),
                c  = iD.Node(),
                d  = iD.Node(),
                w1 = iD.Way({nodes: [c.id, d.id]}),
                w2 = iD.Way({nodes: [c.id, b.id, a.id]}),
                r  = iD.Relation({members: [{id: w2.id, type: 'way'}, {id: w1.id, type: 'way'}]}),
                g  = iD.Graph([a, b, c, d, w1, w2, r]);

            expect(r.multipolygon(g)).to.eql([[[a, b, c, d]]]);
        });

        specify("single polygon with single single-way inner", function () {
            var a = iD.Node({loc: [0, 0]}),
                b = iD.Node({loc: [1, 0]}),
                c = iD.Node({loc: [0, 1]}),
                d = iD.Node({loc: [0.1, 0.1]}),
                e = iD.Node({loc: [0.2, 0.1]}),
                f = iD.Node({loc: [0.1, 0.2]}),
                outer = iD.Way({nodes: [a.id, b.id, c.id, a.id]}),
                inner = iD.Way({nodes: [d.id, e.id, f.id, d.id]}),
                r = iD.Relation({members: [{id: outer.id, type: 'way'}, {id: inner.id, role: 'inner', type: 'way'}]}),
                g = iD.Graph([a, b, c, d, e, f, outer, inner, r]);

            expect(r.multipolygon(g)).to.eql([[[a, b, c, a], [d, e, f, d]]]);
        });

        specify("single polygon with single multi-way inner", function () {
            var a = iD.Node({loc: [0, 0]}),
                b = iD.Node({loc: [1, 0]}),
                c = iD.Node({loc: [0, 1]}),
                d = iD.Node({loc: [0.1, 0.1]}),
                e = iD.Node({loc: [0.2, 0.1]}),
                f = iD.Node({loc: [0.2, 0.1]}),
                outer = iD.Way({nodes: [a.id, b.id, c.id, a.id]}),
                inner1 = iD.Way({nodes: [d.id, e.id]}),
                inner2 = iD.Way({nodes: [e.id, f.id, d.id]}),
                r = iD.Relation({members: [
                    {id: outer.id, type: 'way'},
                    {id: inner2.id, role: 'inner', type: 'way'},
                    {id: inner1.id, role: 'inner', type: 'way'}]}),
                graph = iD.Graph([a, b, c, d, e, f, outer, inner1, inner2, r]);

            expect(r.multipolygon(graph)).to.eql([[[a, b, c, a], [d, e, f, d]]]);
        });

        specify("single polygon with multiple single-way inners", function () {
            var a = iD.Node({loc: [0, 0]}),
                b = iD.Node({loc: [1, 0]}),
                c = iD.Node({loc: [0, 1]}),
                d = iD.Node({loc: [0.1, 0.1]}),
                e = iD.Node({loc: [0.2, 0.1]}),
                f = iD.Node({loc: [0.1, 0.2]}),
                g = iD.Node({loc: [0.2, 0.2]}),
                h = iD.Node({loc: [0.3, 0.2]}),
                i = iD.Node({loc: [0.2, 0.3]}),
                outer = iD.Way({nodes: [a.id, b.id, c.id, a.id]}),
                inner1 = iD.Way({nodes: [d.id, e.id, f.id, d.id]}),
                inner2 = iD.Way({nodes: [g.id, h.id, i.id, g.id]}),
                r = iD.Relation({members: [
                    {id: outer.id, type: 'way'},
                    {id: inner2.id, role: 'inner', type: 'way'},
                    {id: inner1.id, role: 'inner', type: 'way'}]}),
                graph = iD.Graph([a, b, c, d, e, f, g, h, i, outer, inner1, inner2, r]);

            expect(r.multipolygon(graph)).to.eql([[[a, b, c, a], [d, e, f, d], [g, h, i, g]]]);
        });

        specify("multiple polygons with single single-way inner", function () {
            var a = iD.Node({loc: [0, 0]}),
                b = iD.Node({loc: [1, 0]}),
                c = iD.Node({loc: [0, 1]}),
                d = iD.Node({loc: [0.1, 0.1]}),
                e = iD.Node({loc: [0.2, 0.1]}),
                f = iD.Node({loc: [0.1, 0.2]}),
                g = iD.Node({loc: [0, 0]}),
                h = iD.Node({loc: [-1, 0]}),
                i = iD.Node({loc: [0, -1]}),
                outer1 = iD.Way({nodes: [a.id, b.id, c.id, a.id]}),
                outer2 = iD.Way({nodes: [g.id, h.id, i.id, g.id]}),
                inner = iD.Way({nodes: [d.id, e.id, f.id, d.id]}),
                r = iD.Relation({members: [
                    {id: outer2.id, type: 'way'},
                    {id: outer1.id, type: 'way'},
                    {id: inner.id, role: 'inner', type: 'way'}]}),
                graph = iD.Graph([a, b, c, d, e, f, g, h, i, outer1, outer2, inner, r]);

            expect(r.multipolygon(graph)).to.eql([[[a, b, c, a], [d, e, f, d]], [[g, h, i, g]]]);
        });
    });
});
