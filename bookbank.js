Titles = new Meteor.Collection("titles");

if (Meteor.isClient) {

  Meteor.subscribe("todays_books");

  // TODO: today seems a good candidate for a standard helper
  Template.daily_out.today = function () {
    return new Date().toDateString();
  };

  Template.titles.titles_in_stock = function () {
    return Titles.find({}, {sort: {title: 1}});
  };

  Template.isbn_input.new_isbn = function () {
    return Session.get("new_isbn") || "";
  };

  Template.isbn_input.events({
    'keypress input.isbn': function(event) {
      if (event.which == 13) {
        var isbn = ISBN.parse(event.target.value.trim());

        if (isbn) {
          console.log(isbn.asIsbn13(true));
          event.target.value = isbn.asIsbn13();

          var newIsbn = isbn.asIsbn13();
          Session.set("new_isbn", newIsbn);
          var item = Titles.findOne({isbn: newIsbn});
 
          if (item) {
            Titles.update(item._id, {$inc: {count: 1}});
          } else {
            Meteor.call('queryIsbn', newIsbn, function(error, result) {
              if (result.statusCode == 200) 
                var content = EJSON.parse(result.content);
                if (content.totalItems >= 1) {
                  var volumeInfo = content.items[0].volumeInfo;
                  if (volumeInfo) {
                    var title = volumeInfo.title;
                    var author = volumeInfo.authors.join(", ");

                    Titles.insert({title: title, author: author, isbn: newIsbn, count: 1});
                  }
                }
              }
            );
          }
        }
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
  Meteor.publish("todays_books", function () {
    var start = new Date().getDay();
    var end = start;
    return Titles.find({date: {$gte: start, $lte: end}});
  });

  Meteor.startup(function () {
    if (Titles.find().count() === 0) {
      var isbns = ['1550373927', '0534420753', '0241105161', '7544253996', '9780671449025', '9781470104009'];
/* TODO: 9787544253994 or its equivalent 7544253996 fails to be parsed by ISBN.js */
      for (var i = 0; i < isbns.length; i++) {
        var isbn = ISBN.parse(isbns[i]);

        if (!isbn)
          continue;

        isbn13 = isbn.asIsbn13();

        var response = Meteor.http.get("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn13);
        if (response.statusCode != 200) 
          continue;

        var content = EJSON.parse(response.content);
        if (content.totalItems < 1)
          continue;

        var volumeInfo = content.items[0].volumeInfo;
        if (!volumeInfo)
          continue;

        var title = volumeInfo.title;
        var author = volumeInfo.authors.join(", ");
        Titles.insert({title: title, author: author, isbn: isbn13, date: new Date(), count: 1});
      }
    }
  });

  Meteor.methods({
    queryIsbn: function (isbn) {
      this.unblock();
      return Meteor.http.get("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn);
    }
  });
}
