iD.Relation = iD.Entity.relation = function iD_Relation() {
    if (!(this instanceof iD_Relation)) {
        return (new iD_Relation()).initialize(arguments);
    } else if (arguments.length) {
        this.initialize(arguments);
    }
};

iD.Relation.prototype = Object.create(iD.Entity.prototype);

_.extend(iD.Relation.prototype, {
    type: "relation",
    members: [],

    extent: function() {
        return [[NaN, NaN], [NaN, NaN]];
    },

    geometry: function() {
        return 'relation';
    }
});
