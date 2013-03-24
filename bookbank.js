Titles = new Meteor.Collection("titles");

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Books Given Away Today at the Children's Book Bank!";
  };

  Template.titles.titles_in_stock = function () {
    return Titles.find({}, {sort: {title: 1}});
  };

  Template.book.events({
    'keypress input.isbn': function(event) {
      if (event.which == 13) {
        var isbn = ISBN.parse(event.target.value.trim());

        if (isbn) {
          Titles.update(this._id, {$set: {isbn: isbn.asIsbn13()}, $inc: {count: 1}});
        
          // TODO: pull data from Google Books API and update record ...
        } else {
          isbn = ISBN.parse(this.isbn);
        }

        // TODO: figure out how to display with hyphenation
        console.log(isbn.asIsbn13(true));
        event.target.value = isbn.asIsbn13(true);
      }
    },

    'click input.dec': function() {
      if (this.count > 0)
        Titles.update(this._id, {$inc: {count: -1}});
    },

    'click input.inc': function() {
      Titles.update(this._id, {$inc: {count: 1}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // TODO: populate with initial set of ISBNs
    // TODO: validate ISBN ...

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

    if (Titles.findOne({author: {$exists : false}})) {
      Titles.update({}, {$set: {author: "author name here"}}, {multi: true});
    }

    if (Titles.findOne({isbn: {$exists : false}})) {
      Titles.update({}, {$set: {isbn: "isbn here"}}, {multi: true});
    }
  });
}
