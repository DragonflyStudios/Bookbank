
Documentation:

Google Books API: https://developers.google.com/books/docs/v1/getting_started
Google Books API JSONP: https://developers.google.com/books/docs/v1/getting_started#JSONP

ISBN: http://en.wikipedia.org/wiki/International_Standard_Book_Number

~~

Libraries:

1. ISBNJS: https://code.google.com/p/isbnjs/
   - /* TODO: 9787544253994 or its equivalent 7544253996 fails to be parsed by ISBN.js */


~~

Features

[ ] Barcode scanner
[ ] Book Checkout
    [ ] Use ISBN to grab book data from Google Books
    [ ] Maintain a database of books checked out
        [ ] A flat one with a record for each checkout, with timestamp
            // total has been 400K; need to handle 100M of records; to be safe: 1G to be safe
        [ ] Summaries/stats
            [ ] Time periods: today, this week, this month, this year, date-to-date
            [ ] Particular authors
            [ ] Rankings by title, by author, by series ...
    [ ] Update social media
[ ] Book Checkin

~~
[ ] Checkout UI
    [ ] "Selected": a center-aligned row of input fields for
        [ ] Title (text), author (text), ISBN (text), count (text? number?), INC button, DEC button
        [ ] OK button for updating DB
        [ ] Press enter in any of the input fields triggers OK
    [x] "Today's list": list of all books checked out today
        [ ] Select a row in the list brings the data up to the "Selected" for editing
        [ ] Selected row is highlighted
        [ ] Today's list scrolls

[x] Put ISBN input at the top
[x] Pull book record from Google Books API

[x] ISBN validation

[x] Make ISBN an editable field
[x] '-' & '+' buttons around the number
