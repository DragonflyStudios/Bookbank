Titles = new Meteor.Collection("titles");

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to the Children's Book Bank!";
  };

  Template.titles.titles_in_stock = function () {
    return Titles.find({}, {sort: {title: 1}});
  };

  Template.book.events({
    'click input.inc': function() {
      Titles.update(this._id, {$inc: {count: 1}});
    },

    'click input.dec': function() {
      Titles.update(this._id, {$inc: {count: (this.count > 0) ? -1 : 0}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Titles.find().count() === 0) {
      var titles = ["Bridge to Terabithia", 2,
                   "One Hundred Years of Solitude", 99,
                   "Effective Java", 1,
                   "Inkspell", 0,
                   "Charlotte's Web", 3,
                   "Turing, the Enigma", 5];
      for (var i = 0; i < titles.length; i+=2)
        Titles.insert({title: titles[i], count: titles[i+1]});
    }
  });
}
